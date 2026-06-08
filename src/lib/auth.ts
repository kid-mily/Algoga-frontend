import { api } from "@/lib/api"; // 🌟 일반 유저용 api 인스턴스 사용

export const authApi = {
  signup: async (formData: any) => {
    const { passwordConfirm, ...payload } = formData;
    const response = await api.post("/api/v1/auth/signup", payload);
    return response.data;
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data;
  },

  findId: async (payload: { name: string; email: string }) => {
    const response = await api.post("/api/v1/auth/find-id", payload);
    return response.data;
  },

  findPassword: async (payload: { username: string; email: string }) => {
    const response = await api.post("/api/v1/auth/find-password", payload);
    return response.data;
  },

  resetPassword: async (payload: { newPassword: string }) => {
    const response = await api.patch("/api/v1/auth/reset-password", payload);
    return response.data;
  },
};