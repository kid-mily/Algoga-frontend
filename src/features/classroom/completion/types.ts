export interface CourseCompletion {
    completionId: number;
    userId: number;
    courseId: number;
    certificateCode: string;
    completedAt: string;
}

export type CourseCompletionStatus =
    | "idle"
    | "processing"
    | "completed"
    | "already-completed"
    | "failed";