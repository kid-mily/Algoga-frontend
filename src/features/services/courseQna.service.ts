import { adminApi, api, ApiResponse } from "@/lib/api";
import type {
  AdminQnaBase,
  AdminQnaComment,
  AdminQnaItem,
} from "@/features/contentmanage/qna/types";
import type { AdminPage, AdminPageParams } from "./adminPage.types";

type CourseQnaApiResponse<T> = ApiResponse<T> | T;

type RawRecord = Record<string, unknown>;

interface CreateAdminCourseQnaAnswerPayload {
  answer: string;
}

const isRecord = (value: unknown): value is RawRecord => {
  return typeof value === "object" && value !== null;
};

const unwrapData = <T>(response: CourseQnaApiResponse<T>): T => {
  if (isRecord(response) && "data" in response) {
    return response.data as T;
  }

  return response as T;
};

const unwrapList = (data: unknown): unknown[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (isRecord(data)) {
    if (Array.isArray(data.content)) return data.content;
    if (Array.isArray(data.qnas)) return data.qnas;
    if (Array.isArray(data.items)) return data.items;
  }

  return [];
};

const numberOf = (
  record: RawRecord,
  keys: string[],
  fallback = 0
): number => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
};

const stringOf = (
  record: RawRecord,
  keys: string[],
  fallback = ""
): string => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
};

const booleanOf = (
  record: RawRecord,
  keys: string[],
  fallback = false
): boolean => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return fallback;
};

const getWriterName = (
  record: RawRecord,
  fallback = "익명"
): string => {
  return stringOf(
    record,
    [
      "userNickname",
      "writerNickname",
      "nickname",
      "writer",
      "name",
      "userName",
      "username",
    ],
    fallback
  );
};

const normalizeComment = (
  item: unknown,
  fallbackId: number
): AdminQnaComment => {
  const record = isRecord(item) ? item : {};

  const writerType = stringOf(record, ["writerType"], "USER");
  const fallbackWriter = writerType === "MANAGER" ? "관리자" : "익명";

  return {
    id: numberOf(record, ["commentId", "id"], fallbackId),
    writer: getWriterName(record, fallbackWriter),
    content: stringOf(record, ["content", "comment", "reply"]),
    createdAt: stringOf(record, ["createdAt", "updatedAt"]),
  };
};

const normalizeQna = (
  item: unknown,
  fallbackId: number
): AdminQnaBase => {
  const record = isRecord(item) ? item : {};

  const qnaId = numberOf(record, ["qnaId", "id"], fallbackId);
  const question = stringOf(record, ["question", "content"]);
  const answer = stringOf(record, ["answer"]);
  const status = stringOf(record, ["status"]);

  const rawComments = unwrapList(record.comments);
  const comments = rawComments.map((comment, index) =>
    normalizeComment(comment, index + 1)
  );

  if (answer) {
    comments.unshift({
      id: -1,
      writer: "관리자",
      content: answer,
      createdAt: stringOf(record, ["answeredAt", "createdAt"]),
    });
  }

  return {
    id: qnaId,
    userId: numberOf(record, ["userId", "writerId"]),
    title: stringOf(record, ["title"], question.slice(0, 30) || "제목 없음"),
    content: question,
    writer: getWriterName(record),
    createdAt: stringOf(record, ["createdAt"]),
    isAnswered:
      status === "ANSWERED" ||
      booleanOf(record, ["isAnswered"], false) ||
      Boolean(answer),
    comments,
  };
};

// 관리자 QnA 화면은 전체 강의의 QnA를 합쳐 보여주고 클라이언트에서 페이징한다.
// 백엔드가 페이징 기본값(size=10)을 넣으면서 강의별로 10개만 내려오면 합친 목록이
// 잘리므로, 강의당 전체를 받기 위해 size를 크게 명시한다.
const QNA_AGGREGATE_PAGE_SIZE = 1000;

export const getCourseQnas = async (
  courseId: string | number
): Promise<AdminQnaBase[]> => {
  const response = await api.get<CourseQnaApiResponse<unknown>>(
    `/api/v1/courses/${courseId}/qnas`,
    {
      cache: "no-store",
      suppressGlobalError: true,
      params: { size: QNA_AGGREGATE_PAGE_SIZE },
    }
  );

  const data = unwrapData(response);

  return unwrapList(data).map((item, index) =>
    normalizeQna(item, index + 1)
  );
};

export const getCourseQna = async (
  courseId: string | number,
  qnaId: string | number
): Promise<AdminQnaBase> => {
  const response = await api.get<CourseQnaApiResponse<unknown>>(
    `/api/v1/courses/${courseId}/qnas/${qnaId}`,
    {
      cache: "no-store",
      suppressGlobalError: true,
    }
  );

  const data = unwrapData(response);

  return normalizeQna(data, Number(qnaId));
};

export const createAdminCourseQnaAnswer = async (
  courseId: string | number,
  qnaId: string | number,
  payload: CreateAdminCourseQnaAnswerPayload
): Promise<unknown> => {
  const response = await adminApi.post<CourseQnaApiResponse<unknown>>(
    `/api/v1/admin/courses/${courseId}/qnas/${qnaId}/answer`,
    payload,
    {
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
};

export const getAdminCourseQnaPage = async (
  params: AdminPageParams & { answered?: boolean } = {}
): Promise<AdminPage<AdminQnaItem>> => {
  const response = await adminApi.get<ApiResponse<AdminPage<unknown>>>(
    "/api/v1/admin/course-qnas",
    { params, suppressGlobalError: true }
  );
  const page = response.data;

  return {
    ...page,
    content: (page.content ?? []).map((item, index) => {
      const record = isRecord(item) ? item : {};

      return {
        ...normalizeQna(item, index + 1),
        courseId: numberOf(record, ["courseId", "course_id"]),
        lecture: stringOf(record, ["courseTitle", "courseName"], "강의명 없음"),
      };
    }),
  };
};
