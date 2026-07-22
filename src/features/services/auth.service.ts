import {
  FindIdRequest,
  FindIdResponse,
  FindPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "@/features/auth/types";
import { api, ApiResult, unwrapData } from "@/lib/api";

const getBooleanLike = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue === "true" || normalizedValue === "y";
  }
  return Boolean(value);
};

const getPasswordChangeRequired = (record: Record<string, unknown>) => {
  const directValue =
    record.requiresPasswordChange ??
    record.passwordChangeRequired ??
    record.needPasswordChange ??
    record.mustChangePassword ??
    record.temporaryPassword ??
    record.isTemporaryPassword ??
    record.tempPassword ??
    record.forcePasswordChange ??
    record.passwordResetRequired;

  if (directValue !== undefined) {
    return getBooleanLike(directValue);
  }

  const code = String(record.code ?? "").toUpperCase();
  const message = String(record.message ?? "");

  return (
    code.includes("TEMP") ||
    code.includes("PASSWORD_CHANGE") ||
    code.includes("PASSWORD_RESET") ||
    message.includes("임시") ||
    message.includes("비밀번호 변경")
  );
};

const normalizeLoginResponse = (
  value: unknown,
  response?: unknown
): LoginResponse => {
  if (typeof value === "boolean") {
    return { requiresPasswordChange: value };
  }

  const responseRecord =
    response && typeof response === "object"
      ? (response as Record<string, unknown>)
      : {};

  if (!value || typeof value !== "object") {
    return {
      requiresPasswordChange: getPasswordChangeRequired(responseRecord),
    };
  }

  const record = value as Record<string, unknown>;
  const requiresPasswordChange =
    getPasswordChangeRequired(record) || getPasswordChangeRequired(responseRecord);

  return {
    ...record,
    requiresPasswordChange,
  };
};

// 로그인 요청
export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResult<LoginResponse | null>>(
    "/api/v1/auth/login",
    user,
    { skipAuth: true, suppressGlobalError: true }
  );

  return normalizeLoginResponse(
    unwrapData<LoginResponse | null>(response),
    response
  );
}; // 응답 데이터 꺼내기

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
  return api.post("/api/v1/auth/logout", undefined, {
    skipAuth: true,
    suppressGlobalError: true,
  });
};
