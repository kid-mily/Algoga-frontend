export type DiagnosisLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

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
  options: string[];
}

export interface EvaluationAnswer {
  questionId: number;
  selectedOption: number;
}

export interface DiagnosisResultRequest {
  countryId: number;
  answers: EvaluationAnswer[];
}

export interface DiagnosisResultAnswer {
  questionId: number;
  selectedOption: number;
  correctOption: number;
  correct: boolean;
  explanation: string;
}

export interface DiagnosisRecommendedCourseFile {
  fileUrl: string;
  originalFileName: string;
  fileOrder: number;
}

export interface DiagnosisRecommendedCourse {
  courseId: number;
  countryId: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  fileUrls: string[];
  files: DiagnosisRecommendedCourseFile[];
  level: DiagnosisLevel;
  levelName: string;
  status: string;
  enrolled: boolean;
  paid: boolean;
}

export interface DiagnosisResult {
  resultId: number;
  countryId: number;
  correctCount: number;
  totalCount: number;
  score: number;
  level: DiagnosisLevel;
  levelName: string;
  submittedAt: string;
  answers: DiagnosisResultAnswer[];
  recommendedCourses: DiagnosisRecommendedCourse[];
}

export interface PendingDiagnosisSubmit {
  continentCode: string;
  countryId: string;
  payload: DiagnosisResultRequest;
}

export const DIAGNOSIS_RESULT_STORAGE_KEY = "diagnosis-result";
export const PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY =
  "pending-diagnosis-submit";