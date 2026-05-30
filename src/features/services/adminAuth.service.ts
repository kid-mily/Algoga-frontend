// src/features/services/adminAuth.service.ts

import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { AdminLoginRequest , AdminLoginResponse, CreateAdminCoursePayload } from "../contentmanage/types";

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const adminLogin = async (
  payload: AdminLoginRequest
): Promise<AdminLoginResponse> => {
  try {
    const response = await api.post("/api/v1/auth/admin/login", payload);
    return response.data.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "관리자 로그인에 실패했습니다."));
  }
};

export const adminLogout = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
};