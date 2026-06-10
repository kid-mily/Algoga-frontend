const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kidmily.kro.kr";

type TokenKey = "accessToken" | "adminAccessToken";

async function request<T>(
  path: string,
  options: RequestInit = {},
  tokenKey?: TokenKey
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(tokenKey ?? "accessToken")
      : null;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "API 요청 실패");
  }

  return result;
}

export const api = {
  get: <T>(path: string) =>
    request<T>(path, { method: "GET" }, "accessToken"),

  post: <T>(path: string, data?: unknown) =>
    request<T>(
      path,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "accessToken"
    ),

  put: <T>(path: string, data?: unknown) =>
    request<T>(
      path,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "accessToken"
    ),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }, "accessToken"),
};

export const adminApi = {
  get: <T>(path: string) =>
    request<T>(path, { method: "GET" }, "adminAccessToken"),

  post: <T>(path: string, data?: unknown) =>
    request<T>(
      path,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "adminAccessToken"
    ),

  put: <T>(path: string, data?: unknown) =>
    request<T>(
      path,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      "adminAccessToken"
    ),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }, "adminAccessToken"),
};