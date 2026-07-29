import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  BlacklistStatus,
  BlacklistUser,
  BlacklistUserDetail,
  PageResult,
  ReportHistory,
  ReportHistoryStatus,
  ReportHistoryTargetType,
} from "@/features/superadmin/blacklist/types";

type UnknownRecord = Record<string, unknown>;

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getString = (record: UnknownRecord, keys: string[], fallback = "-") => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
};

const getNumber = (record: UnknownRecord, keys: string[], fallback = 0) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  if (typeof value === "number" && Number.isFinite(value)) return value;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const getValidUserId = (item: unknown) => {
  const record = getRecord(item);
  const userId = getNumber(record, ["userId", "memberId", "id"], 0);

  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
};

const formatDate = (value: string) => {
  if (!value || value === "-") return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const getItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.users)) return record.users;
  if (Array.isArray(record.candidates)) return record.candidates;
  if (Array.isArray(record.blacklists)) return record.blacklists;
  if (Array.isArray(record.reports)) return record.reports;

  return [];
};

const getPageMeta = <T>(data: unknown, items: T[], fallbackPage: number): PageResult<T> => {
  const record = getRecord(data);
  const pageValue = getNumber(record, ["index", "page", "number"], NaN);
  const size = getNumber(record, ["size", "pageSize"], items.length || 10);
  const totalElements = getNumber(
    record,
    ["totalElements", "totalCount", "total"],
    items.length
  );
  const totalPages = getNumber(
    record,
    ["totalPages", "pageCount"],
    Math.max(1, Math.ceil(totalElements / Math.max(size, 1)))
  );

  return {
    items,
    page: Number.isFinite(pageValue) ? Math.max(1, pageValue + 1) : fallbackPage,
    size,
    totalElements,
    totalPages: Math.max(1, totalPages),
  };
};

const normalizeStatus = (value: string): BlacklistStatus => {
  const status = value.toUpperCase();

  if (status === "NORMAL" || status === "BLACKLISTED" || status === "DEREGISTERED") {
    return status;
  }

  return "UNKNOWN";
};

const normalizeBlacklistStatus = (record: UnknownRecord): BlacklistStatus => {
  if (typeof record.isBlacklisted === "boolean") {
    return record.isBlacklisted ? "BLACKLISTED" : "NORMAL";
  }

  return normalizeStatus(getString(record, ["status", "userStatus"], "UNKNOWN"));
};

const normalizeReportStatus = (value: string): ReportHistoryStatus => {
  const status = value.toUpperCase();

  if (status === "RECEIVED" || status === "COMPLETED" || status === "REJECTED") {
    return status;
  }

  return "UNKNOWN";
};

const normalizeTargetType = (value: string): ReportHistoryTargetType => {
  const targetType = value.toUpperCase();

  if (targetType === "POST" || targetType === "COMMENT" || targetType === "USER") {
    return targetType;
  }

  return "UNKNOWN";
};

export const normalizeBlacklistUser = (
  item: unknown,
  fallbackId = 0
): BlacklistUser => {
  const record = getRecord(item);
  const userId = getNumber(record, ["userId", "memberId", "id"], fallbackId);
  const isBlacklisted =
    typeof record.isBlacklisted === "boolean"
      ? record.isBlacklisted
      : normalizeStatus(getString(record, ["status", "userStatus"], "UNKNOWN")) ===
        "BLACKLISTED";

  return {
    userId,
    displayId: `U${String(userId).padStart(4, "0")}`,
    username: getString(record, ["username", "loginId", "accountId"], "-"),
    name: getString(record, ["name", "userName", "realName"], "-"),
    nickname: getString(record, ["nickname", "nickName"], "-"),
    email: getString(record, ["email"], "-"),
    reportCount: getNumber(record, ["reportCount", "reportsCount", "reportedCount"]),
    isBlacklisted,
    lastReportedAt: formatDate(
      getString(record, ["lastReportedAt", "recentReportedAt", "reportedAt"], "")
    ),
    registeredAt: formatDate(
      getString(record, ["registeredAt", "blacklistedAt", "createdAt"], "")
    ),
    managerName: getString(record, ["managerName", "adminName", "registeredBy"], "-"),
    status: normalizeBlacklistStatus(record),
  };
};

export const normalizeBlacklistUserDetail = (
  item: unknown,
  fallbackId: number
): BlacklistUserDetail => {
  const record = getRecord(item);
  const user = normalizeBlacklistUser(record, fallbackId);

  return {
    ...user,
    phone: getString(record, ["phone", "phoneNumber"], "-"),
    joinedAt: formatDate(getString(record, ["joinedAt", "createdAt"], "")),
  };
};

export const normalizeReportHistory = (
  item: unknown,
  fallbackId = 0
): ReportHistory => {
  const record = getRecord(item);
  const reportId = getNumber(record, ["reportId", "id"], fallbackId);

  return {
    reportId,
    displayId: `R${String(reportId).padStart(4, "0")}`,
    targetType: normalizeTargetType(getString(record, ["targetType"], "UNKNOWN")),
    reasonType: getString(record, ["reasonType", "reason", "reportReason"], "-"),
    createdAt: formatDate(getString(record, ["createdAt", "reportedAt"], "")),
    status: normalizeReportStatus(getString(record, ["status"], "UNKNOWN")),
  };
};

export const getBlacklistCandidates = async ({
  index = 1,
  size = 10,
  signal,
}: {
  index?: number;
  size?: number;
  signal?: AbortSignal;
} = {}): Promise<PageResult<BlacklistUser>> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/blacklists/candidates",
    {
      params: { page: Math.max(0, index - 1), size },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);
  const items = getItems(data)
    .filter((item) => getValidUserId(item) !== null)
    .map((item) => normalizeBlacklistUser(item));

  return getPageMeta(data, items, index);
};

export const getBlacklistCandidateById = async (
  userId: number,
  signal?: AbortSignal
): Promise<BlacklistUserDetail> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/admin/blacklists/users/${userId}`,
    {
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeBlacklistUserDetail(unwrapData(response), userId);
};

export const registerBlacklistUser = async (
  userId: number,
  reason: string
): Promise<void> => {
  await adminApi.post<ApiResult<null>>(
    `/api/v1/admin/blacklists/${userId}`,
    { reason },
    { suppressGlobalError: true }
  );
};

export const getBlacklistedUsers = async ({
  index = 1,
  size = 10,
  signal,
}: {
  index?: number;
  size?: number;
  signal?: AbortSignal;
} = {}): Promise<PageResult<BlacklistUser>> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/blacklists",
    {
      params: { page: Math.max(0, index - 1), size },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);
  const items = getItems(data)
    .filter((item) => getValidUserId(item) !== null)
    .map((item) => normalizeBlacklistUser(item));

  return getPageMeta(data, items, index);
};

export const deregisterBlacklistUser = async (userId: number): Promise<void> => {
  await adminApi.patch<ApiResult<null>>(
    `/api/v1/admin/blacklists/${userId}/deregister`,
    {},
    { suppressGlobalError: true }
  );
};

export const getReportedUserReports = async ({
  userId,
  index = 1,
  size = 5,
  signal,
}: {
  userId: number;
  index?: number;
  size?: number;
  signal?: AbortSignal;
}): Promise<PageResult<ReportHistory>> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/reports/admin",
    {
      params: { reportedUserId: userId, page: Math.max(0, index - 1), size },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);
  const items = getItems(data).map((item, itemIndex) =>
    normalizeReportHistory(item, itemIndex + 1)
  );

  return getPageMeta(data, items, index);
};
