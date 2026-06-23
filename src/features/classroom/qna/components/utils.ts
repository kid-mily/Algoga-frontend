import { QnaStatus, QnaWriterType } from "./types";

export const formatQnaDate = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export const formatQnaDateTime = (date: string) => {
    return new Date(date).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getStatusLabel = (status: QnaStatus) => {
    return status === "ANSWERED" ? "답변완료" : "답변대기";
};

export const getWriterLabel = (writerType: QnaWriterType) => {
    return writerType === "MANAGER" ? "여행 매니저" : "수강생";
};