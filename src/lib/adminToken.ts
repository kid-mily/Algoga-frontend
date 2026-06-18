import { getCookie } from "./cookie";

export type AdminTokenPayload = {
  sub?: string;
  role?: string;
  type?: string;
  authority?: string;
  authorities?: string[] | string;
  id?: number;
  exp?: number;
};

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

export const hasAdminRole = (
  payload: AdminTokenPayload | null,
  roles: string[]
) => {
  const normalizedRoles = roles.flatMap((role) => [
    role,
    role.startsWith("ROLE_") ? role.replace("ROLE_", "") : `ROLE_${role}`,
  ]);

  return getAdminRoleCandidates(payload).some((candidate) =>
    normalizedRoles.includes(candidate)
  );
};

export const getCurrentAdminPayload = () => {
  if (typeof window === "undefined") return null;

  const token = getCookie("adminAccessToken");

  if (!token) return null;

  const payload = decodeJwtPayload(token);

  if (!payload || isAdminTokenExpired(payload)) return null;

  return payload;
};

export const getAdminRedirectPath = (token: string) => {
  const payload = decodeJwtPayload(token);

  if (hasAdminRole(payload, ["SUPER_ADMIN"])) {
    return "/superadmin/manage";
  }

  if (hasAdminRole(payload, ["CS_MANAGER"])) {
    return "/csadmin/inquiry";
  }

  if (hasAdminRole(payload, ["SETTLEMENT_MANAGER"])) {
    return "/moneyadmin/payments";
  }

  return "/contentadmin/lecture";
};
