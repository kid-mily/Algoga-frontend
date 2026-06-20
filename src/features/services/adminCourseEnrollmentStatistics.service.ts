import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  CourseEnrollmentPage,
  CourseEnrollmentStatistic,
} from "@/features/statisticadmin/lecture-analysis/types";

type UnknownRecord = Record<string, unknown>;

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getNumber = (record: UnknownRecord, keys: string[], fallback = 0) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== null && item !== undefined);

  if (typeof value === "number" && Number.isFinite(value)) return value;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const getString = (record: UnknownRecord, keys: string[], fallback = "-") => {
  const value = keys
    .map((key) => record[key])
    .find(
      (item) =>
        item !== null &&
        item !== undefined &&
        !(typeof item === "string" && !item.trim())
    );

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return fallback;
};

const getItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.courses)) return record.courses;
  if (Array.isArray(record.data)) return record.data;

  return [];
};

const normalizeCourseEnrollmentStatistic = (
  item: unknown
): CourseEnrollmentStatistic | null => {
  const record = getRecord(item);
  const courseId = getNumber(record, ["courseId", "course_id", "id"], Number.NaN);

  if (!Number.isSafeInteger(courseId) || courseId <= 0) return null;

  return {
    courseId,
    courseTitle: getString(record, ["courseTitle", "title", "name"], "강의명 없음"),
    studentCount: getNumber(record, ["studentCount", "students", "enrollmentCount"]),
    averageProgressRate: getNumber(record, [
      "averageProgressRate",
      "avgProgressRate",
      "averageProgress",
    ]),
    completionRate: getNumber(record, ["completionRate", "completeRate"]),
    averageLearningHours: getNumber(record, [
      "averageLearningHours",
      "averageStudyHours",
      "averageLearningTime",
    ]),
  };
};

export const getCourseEnrollmentStatistics = async ({
  keyword = "",
  page = 1,
  size = 10,
  signal,
}: {
  keyword?: string;
  page?: number;
  size?: number;
  signal?: AbortSignal;
}): Promise<CourseEnrollmentPage> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/statistics/courses/enrollment",
    {
      params: {
        keyword: keyword.trim() || undefined,
        page: Math.max(0, page - 1),
        size,
      },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData<unknown>(response);
  const record = getRecord(data);
  const content = getItems(data)
    .map(normalizeCourseEnrollmentStatistic)
    .filter(
      (item): item is CourseEnrollmentStatistic => item !== null
    );
  const pageNumber = getNumber(record, ["page", "number"], page - 1);
  const totalElements = getNumber(
    record,
    ["totalElements", "totalCount"],
    content.length
  );
  const pageSize = getNumber(record, ["size", "pageSize"], size);
  const fallbackTotalPages = Math.max(1, Math.ceil(totalElements / pageSize));

  return {
    totalElements,
    totalPages: Math.max(
      1,
      getNumber(record, ["totalPages", "totalPage"], fallbackTotalPages)
    ),
    page: pageNumber + 1,
    size: pageSize,
    content,
  };
};
