//사이드바에 보여줄 관리자 이름, 이메일, 역할명을 계산
import { getCurrentAdminPayload, getAdminRoleCandidates } from "@/lib/adminToken";
import {
  getAdminRoleLabel,
  getInitial,
  getStoredAdminDisplayInfo,
  normalizeRole,
} from "./adminSession";
import type { AdminDisplayInfo } from "../types";

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
