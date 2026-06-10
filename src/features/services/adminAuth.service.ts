import { api, ApiResponse } from "@/lib/api";
import {
  AdminLoginRequest,
  AdminLoginResponse,
} from "../contentmanage/auth/types";

export const adminLogin = async (
  payload: AdminLoginRequest
): Promise<AdminLoginResponse> => {
  const response = await api.post<ApiResponse<AdminLoginResponse>>(
    "/api/v1/auth/admin/login",
    payload
  );

  return response.data;
};

export const adminLogout = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
};