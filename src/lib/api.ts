const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kidmily.kro.kr";

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
  next?: { revalidate?: number | false; tags?: string[] };
};

let refreshPromise: Promise<boolean> | null = null;

export class ApiRequestError extends Error {
  status?: number;
  code?: string;
  url?: string;
  body?: unknown;

  constructor({
    message,
    status,
    code,
    url,
    body,
  }: {
    message: string;
    status?: number;
    code?: string;
    url?: string;
    body?: unknown;
  }) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.url = url;
    this.body = body;
  }
}

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

const refreshAccessToken = async (refreshPath: string) => {
  if (typeof window === "undefined") return false;

  refreshPromise ??= fetch(buildUrl(refreshPath), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

  async function request<T>(
    path: string,
    options: ApiRequestOptions = {},
    refreshPath = "/api/v1/auth/refresh"
  ): Promise<T> {
  const {
    params,
    suppressGlobalError,
    skipAuth,
    timeoutMs = 15000,
    signal,
    ...fetchOptions
  } = options;

  const isFormData = fetchOptions.body instanceof FormData;
  const hasBody = fetchOptions.body !== undefined && fetchOptions.body !== null;
  const headers = new Headers(fetchOptions.headers);

  headers.set("Accept", "application/json");

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

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
  const requestUrl = buildUrl(path, params);

  try {
    response = await fetch(requestUrl, {
      ...fetchOptions,
      credentials: fetchOptions.credentials ?? "include",
      signal: controller.signal,
      headers,
    });

    const shouldRefresh =
    (response.status === 401 || response.status === 403) &&
    !skipAuth &&
    path !== refreshPath &&
    typeof window !== "undefined";

  if (shouldRefresh) {
    const refreshed = await refreshAccessToken(refreshPath);

    if (refreshed && !controller.signal.aborted) {
      response = await fetch(requestUrl, {
        ...fetchOptions,
        credentials: fetchOptions.credentials ?? "include",
        signal: controller.signal,
        headers,
      });
    }
  }
  } catch (error: unknown) {
    if (didTimeout) {
      throw new ApiRequestError({
        message: "API 요청 시간이 초과되었습니다.",
        url: requestUrl,
      });
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

    throw new ApiRequestError({
      message: result?.message || "API 요청 실패",
      status: response.status,
      code: result?.code,
      url: requestUrl,
      body: result,
    });
  }

  return result as T;
}

const createApi = (refreshPath = "/api/v1/auth/refresh") => ({
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "GET" }, refreshPath),

  post: <T>(path: string, data?: unknown, options?: ApiRequestOptions) =>
    request<T>(
      path,
      {
        ...options,
        method: "POST",
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      refreshPath
    ),

  put: <T>(path: string, data?: unknown, options?: ApiRequestOptions) =>
    request<T>(
      path,
      {
        ...options,
        method: "PUT",
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      refreshPath
    ),

  patch: <T>(path: string, data?: unknown, options?: ApiRequestOptions) =>
    request<T>(
      path,
      {
        ...options,
        method: "PATCH",
        body: data instanceof FormData ? data : JSON.stringify(data),
      },
      refreshPath
    ),

  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }, refreshPath),
});

export const api = createApi("/api/v1/auth/refresh");
export const adminApi = createApi("/api/v1/auth/admin/refresh");
