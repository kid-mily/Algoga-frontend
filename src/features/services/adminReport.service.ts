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
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== null && item !== undefined);

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  const parsedValue = Number(value ?? fallback);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const getString = (
  record: RawReportRecord,
  keys: string[],
  fallback = ""
) => {
  const value = keys
    .map((key) => record[key])
    .find(
      (item) =>
        item !== null &&
        item !== undefined &&
        !(typeof item === "string" && !item.trim())
    );

  return typeof value === "string" ? value : fallback;
};

const getNestedRecord = (
  record: RawReportRecord,
  keys: string[]
): RawReportRecord => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== null && item !== undefined);

  return getRecord(value);
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

const reportReasonLabel: Record<string, string> = {
  SPAM: "스팸/광고",
  ABUSE: "욕설/비방",
  FALSE_INFO: "허위 정보",
  INAPPROPRIATE: "부적절한 콘텐츠",
  COPYRIGHT: "저작권 침해",
  ETC: "기타",
};

const formatReportReason = (value: string) => {
  const reason = value.trim();

  if (!reason || reason === "-") return "-";

  return reportReasonLabel[reason.toUpperCase()] ?? reason;
};

export const normalizeReport = (item: unknown, fallbackId = 0): AdminReport => {
  const record = getRecord(item);
  const reporter = getNestedRecord(record, ["reporter", "reporterUser", "reportingUser", "user"]);
  const reportedUser = getNestedRecord(record, [
    "reportedUser",
    "targetUser",
    "reported",
    "targetMember",
  ]);
  const post = getNestedRecord(record, ["post", "targetPost"]);
  const targetType = getString(record, ["targetType", "type"], "POST").toUpperCase();
  const status = getString(record, ["status", "reportStatus"], "RECEIVED").toUpperCase();

  return {
    reportId: getNumber(record, ["reportId", "id"], fallbackId),
    reporterId: getNumber(record, ["reporterId", "reporterUserId", "reportingUserId"], getNumber(reporter, ["userId", "memberId", "id"])),
    reporterName: getString(record, ["reporterName", "reporterNickname", "reportingUserName", "userName", "nickname"], getString(reporter, ["name", "userName", "nickname", "email"], "-")),
    reportedUserId: getNumber(
      record,
      ["reportedUserId", "targetUserId", "reportedMemberId"],
      getNumber(reportedUser, ["userId", "memberId", "id"])
    ),
    reportedUserName: getString(
      record,
      [
        "reportedUserName",
        "reportedUserNickname",
        "targetUserName",
        "targetUserNickname",
        "reportedNickname",
        "targetNickname",
      ],
      getString(reportedUser, ["nickname", "name", "userName", "email"], "-")
    ),
    targetType: targetType === "COMMENT" ? "COMMENT" : "POST",
    targetId: getNumber(record, ["targetId", "postId", "commentId"]),
    postTitle: getString(
      record,
      ["postTitle", "targetPostTitle", "targetTitle", "title"],
      getString(post, ["title", "postTitle"], "-")
    ),
    reason: formatReportReason(
      getString(record, ["reasonType", "reason", "reportReason", "reportReasonType"], "-")
    ),
    content: getString(record, ["content", "targetContent", "description"], "-"),
    status:
      status === "REJECTED" || status === "COMPLETED" || status === "RECEIVED"
        ? (status as ReportStatus)
        : "RECEIVED",
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
  status,
  targetType,
  keyword,
  signal,
}: {
  page?: number;
  size?: number;
  status?: ReportStatus | "ALL";
  targetType?: ReportTargetType | "ALL";
  keyword?: string;
  signal?: AbortSignal;
} = {}): Promise<AdminReportPage> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/reports/admin",
    {
      params: {
        page,
        size,
        status: status && status !== "ALL" ? status : undefined,
        targetType: targetType && targetType !== "ALL" ? targetType : undefined,
        keyword: keyword?.trim() || undefined,
      },
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
    await adminApi.delete<ApiResult<null>>(`/api/v1/comments/admin/${targetId}`, {
      suppressGlobalError: true,
    });
    return;
  }

  await adminApi.delete<ApiResult<null>>(`/api/v1/posts/admin/${targetId}`, {
    suppressGlobalError: true,
  });
};

export const rejectAdminReport = async (reportId: number): Promise<void> => {
  await adminApi.patch<ApiResult<null>>(
    `/api/v1/reports/admin/${reportId}/reject`,
    undefined,
    { suppressGlobalError: true }
  );
};

export const completeAdminReport = async (reportId: number): Promise<void> => {
  await adminApi.patch<ApiResult<null>>(
    `/api/v1/reports/admin/${reportId}/complete`,
    undefined,
    { suppressGlobalError: true }
  );
};
