import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminReport,
  AdminReportPage,
  RawReportRecord,
  ReportStatus,
  ReportTargetType,
} from "@/features/csadmin/report/types";

const getRecord = (item: unknown): RawReportRecord =>
  item && typeof item === "object" ? (item as RawReportRecord) : {};

const getNumber = (
  record: RawReportRecord,
  keys: string[],
  fallback = 0
) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  return typeof value === "number" ? value : Number(value ?? fallback);
};

const getString = (
  record: RawReportRecord,
  keys: string[],
  fallback = ""
) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  return typeof value === "string" ? value : fallback;
};

const getPageItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.reports)) return record.reports;

  return [];
};

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
};

export const normalizeReport = (item: unknown, fallbackId = 0): AdminReport => {
  const record = getRecord(item);
  const targetType = getString(record, ["targetType", "type"], "POST").toUpperCase();
  const status = getString(record, ["status", "reportStatus"], "PENDING").toUpperCase();

  return {
    reportId: getNumber(record, ["reportId", "id"], fallbackId),
    reporterId: getNumber(record, ["reporterId", "userId", "memberId"]),
    reporterName: getString(record, ["reporterName", "userName", "nickname"], "-"),
    targetType: targetType === "COMMENT" ? "COMMENT" : "POST",
    targetId: getNumber(record, ["targetId", "postId", "commentId"]),
    reason: getString(record, ["reason", "reportReason"], "-"),
    content: getString(record, ["content", "targetContent", "description"], "-"),
    status:
      status === "REJECTED" || status === "COMPLETED"
        ? (status as ReportStatus)
        : "PENDING",
    createdAt: formatDateTime(getString(record, ["createdAt", "reportedAt"])),
    processedAt: getString(record, ["processedAt", "updatedAt"]) || null,
  };
};

export const normalizeReportPage = (data: unknown): AdminReportPage => {
  const record = getRecord(data);
  const reports = getPageItems(data).map((item, index) =>
    normalizeReport(item, index + 1)
  );

  return {
    reports,
    page: getNumber(record, ["page", "number"], 0),
    size: getNumber(record, ["size"], reports.length || 10),
    totalElements: getNumber(record, ["totalElements", "totalCount"], reports.length),
    totalPages: getNumber(record, ["totalPages"], reports.length > 0 ? 1 : 0),
    first: Boolean(record.first ?? true),
    last: Boolean(record.last ?? true),
  };
};

export const getAdminReports = async ({
  page = 0,
  size = 10,
  signal,
}: {
  page?: number;
  size?: number;
  signal?: AbortSignal;
} = {}): Promise<AdminReportPage> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/reports/admin",
    {
      params: { page, size },
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeReportPage(unwrapData(response));
};

export const getAdminReportById = async (
  reportId: number,
  signal?: AbortSignal
): Promise<AdminReport> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/reports/admin/${reportId}`,
    {
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeReport(unwrapData(response), reportId);
};

export const deleteReportedTarget = async (
  targetType: ReportTargetType,
  targetId: number
): Promise<void> => {
  if (targetType === "COMMENT") {
    await adminApi.delete<ApiResult<null>>(`/api/v1/comments/admin/${targetId}`);
    return;
  }

  await adminApi.delete<ApiResult<null>>(`/api/v1/posts/admin/${targetId}`);
};

export const rejectAdminReport = async (reportId: number): Promise<void> => {
  await adminApi.patch<ApiResult<null>>(
    `/api/v1/reports/admin/${reportId}/reject`
  );
};

export const completeAdminReport = async (reportId: number): Promise<void> => {
  await adminApi.patch<ApiResult<null>>(
    `/api/v1/reports/admin/${reportId}/complete`
  );
};
