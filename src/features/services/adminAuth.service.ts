import { adminApi, api, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminRole,
} from "@/features/admin/auth/types";

const normalizeRole = (role: AdminRole | undefined) => {
  return role?.replace(/^ROLE_/, "").toUpperCase() ?? "";
};

const firstRole = (roles: AdminLoginResponse["roles"]) => {
  if (Array.isArray(roles)) {
    return roles[0];
  }

  return roles;
};

export const getAdminLoginRole = (admin: AdminLoginResponse) => {
  return normalizeRole(
    admin.role ??
      admin.managerRole ??
      admin.authority ??
      firstRole(admin.authorities) ??
      firstRole(admin.roles) ??
      admin.type
  );
};

export const getAdminRedirectPathByRole = (role: string) => {
  if (role === "SUPER_ADMIN") {
    return "/superadmin/manage";
  }

  if (role === "CS_MANAGER") {
    return "/csadmin/inquiry";
  }

  if (role === "SETTLEMENT_MANAGER") {
    return "/moneyadmin/payments";
  }

  if (role === "STATISTICS_MANAGER") {
    return "/statisticadmin/reservation-conversion";
  }

  return "/contentadmin/lecture";
};

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

export const adminLogout = async () => {
  try {
    await adminApi.post(
      "/api/v1/auth/admin/logout",
      undefined,
      { suppressGlobalError: true }
    );
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    sessionStorage.removeItem("algoga-admin-session-active");
  }
};
