"use client";

import { getCurrentAdminPayload, getAdminRoleCandidates } from "@/lib/adminToken";
import {
  AdminDisplayInfo,
  getAdminRoleLabel,
  getStoredAdminDisplayInfo,
} from "./adminSession";

const normalizeRole = (role?: string | null) => {
  return role?.replace(/^ROLE_/, "").toUpperCase() || "";
};

const getInitial = (name: string) => {
  return name.trim().charAt(0).toUpperCase() || "?";
};

export const getCurrentAdminDisplayInfo = (
  fallbackRole = "CONTENT_MANAGER"
): AdminDisplayInfo => {
  const storedInfo = getStoredAdminDisplayInfo();

  if (storedInfo) return storedInfo;

  const payload = getCurrentAdminPayload();
  const role = normalizeRole(getAdminRoleCandidates(payload)[0] ?? fallbackRole);
  const name =
    payload?.name?.trim() ||
    payload?.loginId?.trim() ||
    payload?.username?.trim() ||
    payload?.sub?.trim() ||
    getAdminRoleLabel(role);
  const email =
    payload?.email?.trim() ||
    payload?.loginId?.trim() ||
    payload?.username?.trim() ||
    payload?.sub?.trim() ||
    "-";

  return {
    name,
    email,
    role,
    roleLabel: getAdminRoleLabel(role),
    initial: getInitial(name),
  };
};
