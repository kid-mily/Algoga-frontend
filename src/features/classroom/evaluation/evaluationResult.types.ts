import { DiagnosisRecommendedCourse } from "./types";

export interface RecommendedCourseFile {
    fileUrl: string;
    originalFileName: string;
    fileOrder: number;
}

export type RecommendedCourse = DiagnosisRecommendedCourse & {
    fileUrls?: string[];
    files?: RecommendedCourseFile[];
};
