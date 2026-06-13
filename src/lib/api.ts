import { getCookie } from "./cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kidmily.kro.kr";

type TokenKey = "accessToken" | "adminAccessToken";

export type ApiResponse<T> = {
  timestamp?: string;
  status?: number;
  code?: string;
  message?: string;
  data: T;
};

export type ApiResult<T> = ApiResponse<T> | T;

export const unwrapData = <T>(response: ApiResult<T>): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

export type ApiRequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
  suppressGlobalError?: boolean;
  timeoutMs?: number;
};

const buildUrl = (
  path: string,
  params?: ApiRequestOptions["params"]
) => {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
  tokenKey: TokenKey = "accessToken"
): Promise<T> {
  const {
    params,
    skipAuth,
    suppressGlobalError,
    timeoutMs = 15000,
    signal,
    ...fetchOptions
  } = options;
  const token =
  !skipAuth && typeof window !== "undefined"
    ? getCookie(tokenKey)
    : null;

  const isFormData = fetchOptions.body instanceof FormData;
  const controller = new AbortController();
  let didTimeout = false;
  const timeoutId =
    timeoutMs > 0
      ? globalThis.setTimeout(() => {
          didTimeout = true;
          controller.abort();
        }, timeoutMs)
      : null;

  const abortRequest = () => controller.abort();
  signal?.addEventListener("abort", abortRequest, { once: true });

  let response: Response;

  try {
    response = await fetch(buildUrl(path, params), {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers || {}),
      },
    });
  } catch (error: unknown) {
    if (didTimeout) {
      throw new Error("API 요청 시간이 초과되었습니다.");
    }

    throw error;
  } finally {
    if (timeoutId) {
      globalThis.clearTimeout(timeoutId);
    }
    signal?.removeEventListener("abort", abortRequest);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    if (!suppressGlobalError && typeof window !== "undefined") {
      sessionStorage.setItem("errorData", JSON.stringify(result));

      if (response.status === 500) {
        window.location.href = "/error/500";
      } else {
        window.dispatchEvent(
          new CustomEvent("api-error", { detail: result })
        );
      }
    }

    throw new Error(result?.message || "API 요청 실패");
  }

  return result as T;
}

const createApi = (tokenKey: TokenKey) => ({
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "GET" }, tokenKey),

  post: <T>(path: string, data?: unknown, options?: ApiRequestOptions) =>
    request<T>(
      path,
      {
        ...options,
        method: "POST",
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      tokenKey
    ),

  put: <T>(path: string, data?: unknown, options?: ApiRequestOptions) =>
    request<T>(
      path,
      {
        ...options,
        method: "PUT",
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      tokenKey
    ),

  patch: <T>(path: string, data?: unknown, options?: ApiRequestOptions) =>
    request<T>(
      path,
      {
        ...options,
        method: "PATCH",
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      tokenKey
    ),

  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }, tokenKey),
});

export const api = createApi("accessToken");
export const adminApi = createApi("adminAccessToken");
