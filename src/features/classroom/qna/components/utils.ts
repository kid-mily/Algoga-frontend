import { CourseQna, QnaComment, QnaStatus, QnaWriterType } from "./types";

export const formatQnaDate = (value: string) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
};

export const formatQnaDateTime = (value: string) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const getStatusLabel = (status: QnaStatus) => {
  return status === "ANSWERED" ? "답변 완료" : "답변 대기";
};

export const getWriterLabel = (writerType: QnaWriterType) => {
  return writerType === "MANAGER" ? "관리자" : "작성자";
};

export const getQnaWriterName = (qna: CourseQna) => {
  return (
    qna.userNickname ||
    qna.nickname ||
    qna.writerNickname ||
    qna.writer ||
    "익명"
  );
};

export const getCommentWriterName = (comment: QnaComment) => {
  if (comment.writerType === "MANAGER") {
    return (
      comment.writerNickname ||
      comment.nickname ||
      comment.writer ||
      "관리자"
    );
  }

  return (
    comment.writerNickname ||
    comment.nickname ||
    comment.writer ||
    "익명"
  );
};