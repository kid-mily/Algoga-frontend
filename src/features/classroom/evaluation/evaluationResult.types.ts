import { DiagnosisRecommendedCourse, EvaluationFormQuestion } from "./types";

export interface RecommendedCourseFile {
    fileUrl: string;
    originalFileName: string;
    fileOrder: number;
}

export type RecommendedCourse = DiagnosisRecommendedCourse & {
    fileUrls?: string[];
    files?: RecommendedCourseFile[];
};

export interface StoredDiagnosisAttempt {
    result: import("./types").DiagnosisResult;
    questions: EvaluationFormQuestion[];
}