import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminManager,
  getManagerRoleLabel,
  ManagerApiRecord,
  ManagerRequestPayload,
  ManagerRole,
} from "@/features/superadmin/manager/types";

const formatDate = (value: string | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const unwrapList = (data: unknown): ManagerApiRecord[] => {
  if (Array.isArray(data)) return data as ManagerApiRecord[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.content)) return record.content as ManagerApiRecord[];
    if (Array.isArray(record.managers)) return record.managers as ManagerApiRecord[];
    if (Array.isArray(record.items)) return record.items as ManagerApiRecord[];
  }

  return [];
};

export const normalizeManager = (
  item: ManagerApiRecord,
  index = 0
): AdminManager => {
  const managerId = item.managerId ?? item.id ?? index + 1;
  const role =
    item.role ?? item.managerRole ?? item.authority ?? "CS_MANAGER";

  return {
    managerId,
    displayId: `A${String(managerId).padStart(3, "0")}`,
    loginId: item.loginId ?? item.login_id ?? item.username ?? "",
    name: item.name ?? "-",
    phone: item.phone ?? item.phoneNumber ?? "-",
    email: item.email ?? "-",
    role: role as ManagerRole,
    roleLabel: getManagerRoleLabel(role as ManagerRole),
    createdAt: formatDate(item.createdAt ?? item.created_at),
    active: item.active ?? !(item.isDeleted ?? item.deleted),
  };
};

export const getAdminManagers = async (
  keyword = "",
  signal?: AbortSignal
): Promise<AdminManager[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/managers",
    {
      params: {
        keyword: keyword.trim() || undefined,
      },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return unwrapList(data).map((item, index) => normalizeManager(item, index));
};

export const createAdminManager = async (
  payload: ManagerRequestPayload
): Promise<AdminManager | null> => {
  const response = await adminApi.post<ApiResult<ManagerApiRecord | null>>(
    "/api/v1/admin/managers",
    payload
  );
  const data = unwrapData(response);

  return data ? normalizeManager(data) : null;
};

export const updateAdminManager = async (
  managerId: number,
  payload: ManagerRequestPayload
): Promise<AdminManager | null> => {
  const response = await adminApi.put<ApiResult<ManagerApiRecord | null>>(
    `/api/v1/admin/managers/${managerId}`,
    payload
  );
  const data = unwrapData(response);

  return data ? normalizeManager(data) : null;
};

export const deleteAdminManager = async (managerId: number): Promise<void> => {
  await adminApi.delete<ApiResult<null>>(
    `/api/v1/admin/managers/${managerId}`
  );
};

export const getAdminManagerById = async (
  managerId: number,
  signal?: AbortSignal
): Promise<AdminManager | null> => {
  const managers = await getAdminManagers("", signal);

  return managers.find((manager) => manager.managerId === managerId) ?? null;
};
