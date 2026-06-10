import {
  FindIdRequest,
  FindPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "@/features/auth/types";
import { api, ApiResponse } from "@/lib/api";

type AuthApiResponse<T> = ApiResponse<T> | T;

const unwrapData = <T>(response: AuthApiResponse<T>): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<AuthApiResponse<LoginResponse>>(
    "/api/v1/auth/login",
    user,
    { skipAuth: true }
  );

  return unwrapData<LoginResponse>(response);
};

export const findId = async (payload: FindIdRequest) => {
  return api.post("/api/v1/auth/find-id", payload, { skipAuth: true });
};

export const findPassword = async (payload: FindPasswordRequest) => {
  return api.post("/api/v1/auth/find-password", payload, { skipAuth: true });
};

export const resetPassword = async (payload: ResetPasswordRequest) => {
  return api.patch("/api/v1/auth/reset-password", payload);
};

export const logout = async () => {
  return api.post("/api/v1/auth/logout");
};
