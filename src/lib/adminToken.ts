import { getCookie } from "./cookie";
import { AdminTokenPayload } from "@/features/admin/auth/types";


export const decodeJwtPayload = (token: string): AdminTokenPayload | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const isAdminTokenExpired = (payload: AdminTokenPayload) => {
  if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
    return true;
  }

  return payload.exp <= Math.floor(Date.now() / 1000);
};

export const getAdminRoleCandidates = (payload: AdminTokenPayload | null) => {
  if (!payload) return [];

  const authorities = Array.isArray(payload.authorities)
    ? payload.authorities
    : payload.authorities
      ? [payload.authorities]
      : [];

  return [
    payload.role,
    payload.authority,
    payload.type,
    ...authorities,
  ].filter(Boolean) as string[];
};

export const getCurrentAdminPayload = () => {
  if (typeof window === "undefined") return null;

  const token = getCookie("adminAccessToken");

  if (!token) return null;

  const payload = decodeJwtPayload(token);

  if (!payload || isAdminTokenExpired(payload)) return null;

  return payload;
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
    return "/statisticadmin/sales";
  }
  return "/contentadmin/lecture";
};

export const getAdminRedirectPath = (token: string) => {
  const payload = decodeJwtPayload(token);
  const role = getAdminRoleCandidates(payload)[0] ?? "";
  return getAdminRedirectPathByRole(role);
};
