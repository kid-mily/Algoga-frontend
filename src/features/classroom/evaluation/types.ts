export type DiagnosisLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type DiagnosisOption = 1 | 2 | 3 | 4;

export interface DiagnosisQuestion {
  questionId: number;
  countryId: number;
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  questionOrder: number;
}

export interface EvaluationFormQuestion extends DiagnosisQuestion {
  options: [string, string, string, string];
}

export interface EvaluationAnswer {
  questionId: number;
  selectedOption: DiagnosisOption;
}

export interface DiagnosisResultRequest {
  countryId: number;
  answers: EvaluationAnswer[];
}

export interface DiagnosisResultAnswer {
  questionId: number;
  selectedOption: DiagnosisOption;
  correctOption: DiagnosisOption;
  correct: boolean;
  explanation: string;
}

// GET /api/v1/diagnosis/me/latest 안의 recommendedCourses / otherLevelCourses 기준
export interface DiagnosisRecommendedCourse {
  courseId: number;
  title: string;
  thumbnailUrl?: string | null;
  countryName?: string;
  countryId?: number;
  level: DiagnosisLevel;
  levelName?: string;

  // 기존 카드 UI가 사용하는 값들.
  // 백 응답에 없을 수 있으므로 optional 처리.
  description?: string;
  price?: number;
  enrolled?: boolean;
  paid?: boolean;
  status?: "PUBLISHED";
}

export interface DiagnosisResult {
  resultId: number;
  countryId: number;
  countryName: string;
  correctCount: number;
  totalCount: number;
  score: number;
  level: DiagnosisLevel;
  levelName: string;
  submittedAt: string;
  answers: DiagnosisResultAnswer[];
  // 내 등급에 맞는 강의
  recommendedCourses: DiagnosisRecommendedCourse[];
  // 내 등급을 제외한 나머지 등급 강의 (등급별로 묶이지 않은 단일 목록)
  otherLevelCourses?: DiagnosisRecommendedCourse[];
}