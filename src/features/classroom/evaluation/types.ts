// 진단평가

// 진단평가 난이도
export type DiagnosisLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

// 진단평가 문제
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

// option 배열을 추가한 문제 타입
export interface EvaluationFormQuestion extends DiagnosisQuestion {
  options: string[];
}

// 사용자가 선택한 답안
export interface EvaluationAnswer {
  questionId: number;
  selectedOption: number;
}

// 진단평가 결과 제출 요청
export interface DiagnosisResultRequest {
  countryId: number;
  answers: EvaluationAnswer[];
}

// 진단평가 정답 결과
export interface DiagnosisResultAnswer {
  questionId: number;
  selectedOption: number;
  correctOption: number;
  correct: boolean;
  explanation: string;
}

// 추천 강의 파일
export interface DiagnosisRecommendedCourseFile {
  fileUrl: string;
  originalFileName: string;
  fileOrder: number;
}

// 추천 강의
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

// 진단평가 결과
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

// 결과 페이지에서 사용할 sessionStorage key
export const DIAGNOSIS_RESULT_STORAGE_KEY = "diagnosis-result";