export interface CourseQnaComment {
  id: number;
  writer: string;
  content: string;
  createdAt: string;
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
  content: string;
}

export type RawCourseQna = Record<string, unknown>;

const getNumber = (record: RawCourseQna, keys: string[], fallback = 0) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  return typeof value === "number" ? value : Number(value || fallback);
};

const getString = (record: RawCourseQna, keys: string[], fallback = "") => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  return typeof value === "string" ? value : fallback;
};

const getArray = (record: RawCourseQna, keys: string[]) => {
  const value = keys.map((key) => record[key]).find(Array.isArray);

  return Array.isArray(value) ? value : [];
};

export const normalizeCourseQnaComment = (
  item: unknown,
  fallbackId: number
): CourseQnaComment => {
  const record = typeof item === "object" && item !== null ? item as RawCourseQna : {};

  return {
    id: getNumber(record, ["commentId", "answerId", "replyId", "id"], fallbackId),
    writer: getString(record, ["writer", "userName", "nickname", "author"], "작성자"),
    content: getString(record, ["content", "comment", "answer", "reply"], ""),
    createdAt: getString(record, ["createdAt", "createdDate", "updatedAt"], ""),
  };
};

export const normalizeCourseQna = (item: unknown, fallbackId: number): CourseQna => {
  const record = typeof item === "object" && item !== null ? item as RawCourseQna : {};
  const comments = getArray(record, ["comments", "answers", "replies"]).map(
    (comment, index) => normalizeCourseQnaComment(comment, index + 1)
  );
  const answerContent = getString(record, ["answer", "answerContent"], "");
  const content = getString(record, ["content", "questionContent", "question"], "");
  const title =
    getString(record, ["title", "questionTitle", "subject"], "") ||
    content.slice(0, 30) ||
    "제목 없음";

  return {
    id: getNumber(record, ["qnaId", "id"], fallbackId),
    userId: getNumber(record, ["userId", "user_id", "writerId", "writer_id", "authorId", "author_id", "memberId", "member_id"], 0),
    title,
    content,
    writer: getString(record, ["writer", "userName", "nickname", "author"], "작성자"),
    createdAt: getString(record, ["createdAt", "createdDate", "updatedAt"], ""),
    isAnswered:
      Boolean(record.isAnswered) ||
      Boolean(record.answered) ||
      Boolean(answerContent) ||
      comments.length > 0,
    comments: answerContent
      ? [
          {
            id: 1,
            writer: "관리자",
            content: answerContent,
            createdAt: getString(record, ["answeredAt", "updatedAt", "createdAt"], ""),
          },
          ...comments,
        ]
      : comments,
  };
};
