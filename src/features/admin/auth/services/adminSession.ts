import type { AdminDisplayInfo, AdminDisplayInfoInput } from "../types";

const ADMIN_SESSION_KEY = "algoga-admin-session-active";
const ADMIN_ROLE_KEY = "algoga-admin-role";
const ADMIN_DISPLAY_INFO_KEY = "algoga-admin-display-info";

const canUseSessionStorage = () => typeof window !== "undefined";

const roleLabels: Record<string, string> = {
  CONTENT_MANAGER: "콘텐츠 매니저",
  CS_MANAGER: "CS 매니저",
  SETTLEMENT_MANAGER: "정산 매니저",
  STATISTICS_MANAGER: "통계 매니저",
  SUPER_ADMIN: "슈퍼 관리자",
};

export const normalizeRole = (role?: string | null) => {
  return role?.replace(/^ROLE_/, "").toUpperCase() || "";
};

const getRoleLabel = (role?: string | null) => {
  const normalizedRole = normalizeRole(role);

  return roleLabels[normalizedRole] || "관리자";
};

export const getInitial = (name: string) => {
  return name.trim().charAt(0).toUpperCase() || "?";
};

export const markAdminSessionActive = (role?: string) => {
  if (!canUseSessionStorage()) return;

  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  if (role) {
    sessionStorage.setItem(ADMIN_ROLE_KEY, normalizeRole(role));
  }
};

export const saveAdminDisplayInfo = (
  admin: AdminDisplayInfoInput,
  role: string,
  fallbackLoginId = "관리자"
) => {
  if (!canUseSessionStorage()) return;

  const normalizedRole = normalizeRole(role);
  const name = admin.name?.trim() || admin.loginId?.trim() || fallbackLoginId;
  const email = admin.email?.trim() || admin.loginId?.trim() || fallbackLoginId;
  const displayInfo: AdminDisplayInfo = {
    name,
    email,
    role: normalizedRole,
    roleLabel: getRoleLabel(normalizedRole),
    initial: getInitial(name),
  };

  sessionStorage.setItem(ADMIN_DISPLAY_INFO_KEY, JSON.stringify(displayInfo));
};

export const clearAdminSessionActive = () => {
  if (!canUseSessionStorage()) return;

  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_ROLE_KEY);
  sessionStorage.removeItem(ADMIN_DISPLAY_INFO_KEY);
};

export const isAdminSessionActive = () => {
  if (!canUseSessionStorage()) return false;

  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
};

export const getAdminSessionRole = () => {
  if (!canUseSessionStorage()) return null;

  return sessionStorage.getItem(ADMIN_ROLE_KEY);
};

export const getStoredAdminDisplayInfo = (): AdminDisplayInfo | null => {
  if (!canUseSessionStorage()) return null;

  const rawInfo = sessionStorage.getItem(ADMIN_DISPLAY_INFO_KEY);

  if (!rawInfo) return null;

  try {
    return JSON.parse(rawInfo) as AdminDisplayInfo;
  } catch {
    return null;
  }
};

export const getAdminRoleLabel = (role?: string | null) => {
  return getRoleLabel(role);
};
