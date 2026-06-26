import { api, type ApiResult, unwrapData } from "@/lib/api";

export const authApi = {
  signup: async (formData: Record<string, unknown>) => {
    const payload = { ...formData };
    delete payload.passwordConfirm;

    const response = await api.post<ApiResult<unknown>>(
      "/api/v1/auth/signup",
      payload,
    );

    return unwrapData(response);
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post<ApiResult<unknown>>(
      "/api/v1/auth/login",
      credentials,
    );

    return unwrapData(response);
  },

  findId: async (payload: { name: string; email: string }) => {
    const response = await api.post<ApiResult<unknown>>(
      "/api/v1/auth/find-id",
      payload,
    );

    return unwrapData(response);
  },

  findPassword: async (payload: { username: string; email: string }) => {
    const response = await api.post<ApiResult<unknown>>(
      "/api/v1/auth/find-password",
      payload,
    );

    return unwrapData(response);
  },

  resetPassword: async (payload: { newPassword: string }) => {
    const response = await api.patch<ApiResult<unknown>>(
      "/api/v1/auth/reset-password",
      payload,
    );

    return unwrapData(response);
  },
};