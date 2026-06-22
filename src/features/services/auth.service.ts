import {
  FindIdRequest,
  FindIdResponse,
  FindPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "@/features/auth/types";
import { api, ApiResult, unwrapData } from "@/lib/api";

// 로그인 요청
export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResult<LoginResponse | null>>(
    "/api/v1/auth/login",
    user,
    { skipAuth: true, suppressGlobalError: true }
  );

  return unwrapData<LoginResponse | null>(response) ?? {};
};

// id 찾기 요청
export const findId = async (
  payload: FindIdRequest
): Promise<FindIdResponse> => {
  const response = await api.post<ApiResult<FindIdResponse>>(
    "/api/v1/auth/find-id",
    payload,
    { skipAuth: true, suppressGlobalError: true }
  );

  return unwrapData<FindIdResponse>(response);
};

// 비밀번호 찾기 요청
export const findPassword = async (payload: FindPasswordRequest) => {
  return api.post("/api/v1/auth/find-password", payload, {
    skipAuth: true,
    suppressGlobalError: true,
  });
};

// 비밀번호 변경 요청
export const resetPassword = async (payload: ResetPasswordRequest) => {
  return api.patch("/api/v1/auth/reset-password", payload);
};

// 로그아웃 요청
export const logout = async () => {
  return api.post("/api/v1/auth/logout");
};
