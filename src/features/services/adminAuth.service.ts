import { api, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminLoginRequest,
  AdminLoginResponse,
} from "../contentmanage/auth/types";

export const adminLogin = async (
  payload: AdminLoginRequest
): Promise<AdminLoginResponse> => {
  const response = await api.post<ApiResult<AdminLoginResponse | null>>(
    "/api/v1/auth/admin/login",
    payload,
    { skipAuth: true, suppressGlobalError: true }
  );

  return unwrapData<AdminLoginResponse | null>(response) ?? {};
};

export const adminLogout = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
};

