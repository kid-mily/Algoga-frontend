import { SignupRequest } from "@/features/auth/types";
import { api, ApiResponse } from "@/lib/api";

type SignupApiResponse<T> = ApiResponse<T> | T;

const unwrapData = <T>(response: SignupApiResponse<T>): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

export const signup = async (data: SignupRequest) => {
  return api.post("/api/v1/auth/signup", data);
};

export const sendSignupEmailCode = async (email: string) => {
  const response = await api.post<SignupApiResponse<string>>(
    "/api/v1/auth/email/send-code",
    { email },
    { skipAuth: true }
  );

  return unwrapData(response);
};

export const verifySignupEmailCode = async (email: string, code: string) => {
  const response = await api.post<SignupApiResponse<string>>(
    "/api/v1/auth/email/verify-code",
    { email, code },
    { skipAuth: true }
  );

  return unwrapData(response);
};

export const checkUsernameDuplicate = async (username: string) => {
  const response = await api.get<SignupApiResponse<boolean | string>>(
    "/api/v1/auth/username/check",
    {
      params: { username },
      skipAuth: true,
    }
  );

  return unwrapData(response);
};
