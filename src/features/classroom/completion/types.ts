export interface CourseCompletion {
    completionId: number;
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
