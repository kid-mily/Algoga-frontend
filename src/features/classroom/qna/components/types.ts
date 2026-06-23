export type QnaStatus = "WAITING" | "ANSWERED";

export type QnaWriterType = "USER" | "MANAGER";

export interface CourseQna {
    qnaId: number;
    courseId: number;
    userId: number;
    managerId: number | null;
    title: string;
    question: string;
    answer: string | null;
    status: QnaStatus;
    createdAt: string;
    answeredAt: string | null;
}

export interface QnaComment {
    commentId: number;
    qnaId: number;
    writerId: number;
    writerType: QnaWriterType;
    content: string;
    createdAt: string;
}

export interface CourseQnaDetail extends CourseQna {
    comments: QnaComment[];
}

export interface CreateQnaRequest {
    title: string;
    question: string;
}

export interface CreateQnaCommentRequest {
    content: string;
}