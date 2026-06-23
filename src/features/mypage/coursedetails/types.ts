import type { DiagnosisLevel, DiagnosisRecommendedCourse, DiagnosisResultAnswer } from "@/features/classroom/evaluation/types";

export type CourseLearningStatus =
    | "IN_PROGRESS"
    | "COMPLETED";

export interface MyCourse {
    courseId: number;
    title: string;
    thumbnailUrl: string;
    countryId: number;
    countryName: string;
    continentCode: string;

    totalDurationSeconds: number;
    studentCount: number;
    averageRating: number;
    progressRate: number;
    completedChapterCount: number;
    totalChapterCount: number;
    learningStatus: CourseLearningStatus;
    quizSubmitted: boolean;
    reviewWritten: boolean;
    certificateAvailable: boolean;
    certificateCode: string | null;
    certificateDownloadUrl: string | null;
    accessExpiresAt: string;
    completedAt: string | null;
}

export interface LatestDiagnosisResult {
    resultId: number;
    countryid: number;
    correctCount: number;
    totalCount: number;
    score: number;
    level: DiagnosisLevel;
    levelName: string;
    submittedAt: string;
    answers: DiagnosisResultAnswer[];
    recommendedCourses: DiagnosisRecommendedCourse[];
}