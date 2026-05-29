// src/features/services/auth.service.ts

import {
  FindIdRequest,
  FindPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "@/features/auth/types";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post("/api/v1/auth/login", user);
    return response.data.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "로그인에 실패했습니다."));
  }
};

export const findId = async (payload: FindIdRequest) => {
  try {
    const response = await api.post("/api/v1/auth/find-id", payload);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "아이디 찾기에 실패했습니다."));
  }
};

export const findPassword = async (payload: FindPasswordRequest) => {
  try {
    const response = await api.post("/api/v1/auth/find-password", payload);
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error, "임시 비밀번호 발급에 실패했습니다.")
    );
  }
};

export const resetPassword = async (payload: ResetPasswordRequest) => {
  try {
    const response = await api.patch("/api/v1/auth/reset-password", payload);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "비밀번호 변경에 실패했습니다."));
  }
};