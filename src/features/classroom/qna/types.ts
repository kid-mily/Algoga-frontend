export interface CourseQnaComment {
  id: number;
  writer: string;
  writerType: "USER" | "MANAGER";
  parentCommentId: number | null;
  content: string;
  createdAt: string;
  replies: CourseQnaComment[];
}

export interface CourseQna {
  id: number;
  userId: number;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  isAnswered: boolean;
  comments: CourseQnaComment[];
}

export interface CreateCourseQnaPayload {
  title: string;
  content: string;
}

export interface CreateCourseQnaCommentPayload {
  parentCommentId?: number | null;
  content: string;
}

type Raw = Record<string, unknown>;
const recordOf = (value: unknown): Raw => typeof value === "object" && value !== null ? value as Raw : {};
const numberOf = (record: Raw, keys: string[], fallback = 0) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);
  return typeof value === "number" ? value : Number(value ?? fallback);
};
const stringOf = (record: Raw, keys: string[], fallback = "") => {
  const value = keys.map((key) => record[key]).find((item) => typeof item === "string");
  return typeof value === "string" ? value : fallback;
};
const arrayOf = (record: Raw, keys: string[]) => {
  const value = keys.map((key) => record[key]).find(Array.isArray);
  return Array.isArray(value) ? value : [];
};

export const normalizeCourseQnaComment = (
  item: unknown,
  fallbackId: number
): CourseQnaComment => {
  const record = recordOf(item);
  const writerType = stringOf(record, ["writerType"], "USER");

  return {
    id: numberOf(record, ["commentId", "id"], fallbackId),
    writer: stringOf(record, ["name", "nickname", "writer", "userName", "username"], writerType === "MANAGER" ? "관리자" : "작성자"),
    writerType: writerType === "MANAGER" ? "MANAGER" : "USER",
    parentCommentId: record.parentCommentId === null ? null : numberOf(record, ["parentCommentId"]) || null,
    content: stringOf(record, ["content", "comment", "reply"]),
    createdAt: stringOf(record, ["createdAt", "updatedAt"]),
    replies: arrayOf(record, ["replies"]).map((reply, index) =>
      normalizeCourseQnaComment(reply, fallbackId * 1000 + index + 1)
    ),
  };
};

export const normalizeCourseQna = (item: unknown, fallbackId: number): CourseQna => {
  const record = recordOf(item);
  const answer = stringOf(record, ["answer"]);
  const comments = arrayOf(record, ["comments"]).map((comment, index) =>
    normalizeCourseQnaComment(comment, index + 1)
  );

  if (answer) {
    comments.unshift({
      id: -1,
      writer: "관리자",
      writerType: "MANAGER",
      parentCommentId: null,
      content: answer,
      createdAt: stringOf(record, ["answeredAt", "createdAt"]),
      replies: [],
    });
  }

  const question = stringOf(record, ["question", "content"]);
  return {
    id: numberOf(record, ["qnaId", "id"], fallbackId),
    userId: numberOf(record, ["userId"]),
    title: stringOf(record, ["title"], question.slice(0, 30) || "제목 없음"),
    content: question,
    writer: stringOf(record, ["name", "nickname", "writer", "userName", "username"], "작성자"),
    createdAt: stringOf(record, ["createdAt"]),
    isAnswered: stringOf(record, ["status"]) === "ANSWERED" || Boolean(answer),
    comments,
  };
};
