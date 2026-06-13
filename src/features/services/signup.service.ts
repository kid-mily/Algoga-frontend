import { SignupRequest } from "@/features/auth/types";
import { api, ApiResult, unwrapData } from "@/lib/api";

type UsernameCheckResponse = {
  available?: boolean;
  duplicated?: boolean;
  isDuplicate?: boolean;
  errorCode?: string;
};

export const signup = async (data: SignupRequest) => {
  return api.post("/api/v1/auth/signup", data);
};

export const sendSignupEmailCode = async (
  email: string,
  signal?: AbortSignal
) => {
  const response = await api.post<ApiResult<string>>(
    "/api/v1/auth/email/send-code",
    { email },
    { skipAuth: true, signal }
  );

  return unwrapData(response);
};

export const verifySignupEmailCode = async (email: string, code: string) => {
  const response = await api.post<ApiResult<string>>(
    "/api/v1/auth/email/verify-code",
    { email, code },
    { skipAuth: true }
  );

  return unwrapData(response);
};

export const checkUsernameDuplicate = async (
  username: string,
  signal?: AbortSignal
): Promise<boolean> => {
  const response = await api.get<ApiResult<boolean | UsernameCheckResponse>>(
    "/api/v1/auth/username/check",
    {
      params: { username },
      skipAuth: true,
      signal,
    }
  );

  const result = unwrapData(response);

  if (typeof result === "boolean") {
    return result;
  }

  if (!result || typeof result !== "object") {
    throw new Error("아이디 중복 확인 응답 형식이 올바르지 않습니다.");
  }

  if (result.available !== undefined) {
    return result.available;
  }

  if (result.duplicated !== undefined) {
    return !result.duplicated;
  }

  if (result.isDuplicate !== undefined) {
    return !result.isDuplicate;
  }

  if (result.errorCode === "DUPLICATE_USERNAME") {
    return false;
  }

  throw new Error("아이디 중복 확인 응답 형식이 올바르지 않습니다.");
};
