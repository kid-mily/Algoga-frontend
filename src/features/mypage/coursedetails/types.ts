import type { DiagnosisLevel } from "@/features/classroom/evaluation/types";

export type CourseLearningStatus = "IN_PROGRESS" | "COMPLETED";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface MyCourse {
  courseId: number;
  title: string;
  thumbnailUrl: string | null;
  countryId: number;
  continentCode: string;
  countryName: string;
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
  countryId: number;
  countryName: string;
  correctCount: number;
  totalCount: number;
  score: number;
  level: DiagnosisLevel;
  levelName: string;
  submittedAt: string;
  answers: unknown[];
  recommendedCourses: unknown[];
}