import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { Student } from "../contentmanage/lecture/types";

type StudentResponse = {
  students?: Student[];
  content?: Student[];
  items?: Student[];
  data?: Student[];
};

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

const getString = (record: UnknownRecord, keys: string[], fallback = "") => {
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

const getBoolean = (
  record: UnknownRecord,
  keys: string[],
  fallback = false
) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== null && item !== undefined);

  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    return ["true", "complete", "completed", "done", "y", "yes"].includes(
      value.toLowerCase()
    );
  }

  return fallback;
};

const getItems = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.students)) return record.students;
  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.data)) return record.data;

  return [];
};

const normalizeStudent = (item: unknown): Student => {
  const record = getRecord(item);

  return {
    userId: getNumber(record, ["userId", "user_id", "id"]),
    userName: getString(record, ["userName", "username", "name", "nickname"], "이름 없음"),
    email: getString(record, ["email", "userEmail"], "-"),
    courseId: getNumber(record, ["courseId", "course_id"]),
    courseTitle: getString(record, ["courseTitle", "course_title"]),
    enrolledAt: getString(record, [
      "enrolledAt",
      "enrolled_at",
      "enrollmentDate",
      "enrollment_date",
      "registeredAt",
      "registered_at",
      "joinedAt",
      "joined_at",
      "createdAt",
      "created_at",
    ]),
    progress: getNumber(record, ["progress", "progressRate", "progress_rate"]),
    progressRate: getNumber(record, ["progressRate", "progress", "progress_rate"]),
    completedChapterCount: getNumber(record, [
      "completedChapterCount",
      "completed_chapter_count",
    ]),
    totalChapterCount: getNumber(record, ["totalChapterCount", "total_chapter_count"]),
    quizComplete: getBoolean(record, [
      "quizComplete",
      "quizCompleted",
      "quizSubmitted",
      "quiz_complete",
      "quiz_completed",
      "quiz_submitted",
    ]),
    quizCompleted: getBoolean(record, [
      "quizCompleted",
      "quizComplete",
      "quizSubmitted",
      "quiz_completed",
      "quiz_complete",
      "quiz_submitted",
    ]),
    quizSubmitted: getBoolean(record, [
      "quizSubmitted",
      "quizComplete",
      "quizCompleted",
      "quiz_submitted",
      "quiz_complete",
      "quiz_completed",
    ]),
    reviewWritten: getBoolean(record, [
      "reviewWritten",
      "reviewCreated",
      "review_written",
      "review_created",
    ]),
    reviewCreated: getBoolean(record, [
      "reviewCreated",
      "reviewWritten",
      "review_created",
      "review_written",
    ]),
    status: getString(record, ["status", "learningStatus"]),
    learningStatus: getString(record, ["learningStatus", "status"]),
    accessExpiresAt: getString(record, ["accessExpiresAt", "access_expires_at"]),
    completedAt: getString(record, ["completedAt", "completed_at"]),
  };
};

export const getCourseStudents = async (
  courseId: number,
  signal?: AbortSignal
): Promise<Student[]> => {
  const response = await adminApi.get<ApiResult<StudentResponse | Student[]>>(
    `/api/v1/admin/courses/${courseId}/students`,
    {
      params: { t: Date.now() },
      suppressGlobalError: true,
      signal,
    }
  );

  return getItems(unwrapData(response)).map(normalizeStudent);
};
