import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { AdminReview, ReviewLevel } from "@/features/contentmanage/review/types";

type UnknownRecord = Record<string, unknown>;

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.reviews)) return record.reviews;

  return [];
};

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

const getBoolean = (record: UnknownRecord, keys: string[], fallback = false) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "HIDDEN";

  return fallback;
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

const normalizeLevel = (value: string): ReviewLevel => {
  if (value === "초급" || value === "BEGINNER") return "초급";
  if (value === "고급" || value === "ADVANCED") return "고급";

  return "중급";
};

export const normalizeAdminReview = (
  item: unknown,
  course?: AdminCourse,
  fallbackId = 0
): AdminReview => {
  const record = getRecord(item);
  const courseId = getNumber(record, ["courseId", "course_id"], course?.courseId ?? 0);
  const reviewId = getNumber(record, ["reviewId", "id"], fallbackId);
  const userId = getNumber(record, ["userId", "memberId", "reviewerId"]);

  return {
    id: reviewId,
    courseId,
    level: normalizeLevel(
      getString(record, ["levelName", "level", "courseLevel"], course?.levelName ?? course?.level ?? "중급")
    ),
    packageName: getString(
      record,
      ["courseTitle", "courseName", "title", "packageName"],
      course?.title ?? "-"
    ),
    rating: getNumber(record, ["rating", "score", "star"], 0),
    user: getString(record, ["userName", "reviewerName", "nickname", "name"], "-"),
    userId: userId ? `U${String(userId).padStart(4, "0")}` : "-",
    content: getString(record, ["content", "reviewContent", "comment"], "-"),
    completedAt: formatDate(getString(record, ["completedAt", "completionDate"], "")),
    reviewedAt: formatDate(getString(record, ["reviewedAt", "createdAt", "updatedAt"], "")),
    hidden: getBoolean(record, ["hidden", "isHidden", "visibility"], false),
  };
};

export const getAdminCourseReviews = async (
  course: AdminCourse,
  signal?: AbortSignal
): Promise<AdminReview[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/admin/courses/${course.courseId}/reviews`,
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return getItems(data).map((item, index) =>
    normalizeAdminReview(item, course, index + 1)
  );
};

export const deleteAdminCourseReview = async (
  courseId: number,
  reviewId: number
): Promise<void> => {
  await adminApi.delete<ApiResult<null>>(
    `/api/v1/admin/courses/${courseId}/reviews/${reviewId}`,
    { suppressGlobalError: true }
  );
};

export const updateAdminCourseReviewVisibility = async (
  courseId: number,
  reviewId: number,
  hidden: boolean
): Promise<void> => {
  await adminApi.patch<ApiResult<null>>(
    `/api/v1/admin/courses/${courseId}/reviews/${reviewId}/visibility`,
    { hidden },
    { suppressGlobalError: true }
  );
};
