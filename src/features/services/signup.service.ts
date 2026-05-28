// src/features/services/signup.service.ts

import { SignupRequest } from "@/features/auth/types";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "회원가입에 실패했습니다.";
  }

  if (error instanceof Error) {
    return error.message || "회원가입에 실패했습니다.";
  }

  return "회원가입에 실패했습니다.";
};

export const signup = async (data: SignupRequest) => {
  try {
    const response = await api.post("/api/v1/auth/signup", data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};