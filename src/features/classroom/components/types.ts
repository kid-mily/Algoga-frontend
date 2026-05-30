// 대륙 선택
export interface Continent {
  continentCode: string;
  continentName: string;
  countryCount: number;
  courseCount: number;
}

// 나라 선택
export interface Country {
  countryId: number;
  countryCode: string;
  countryName: string;
  continentCode: string;
  continentName?: string;
  active?: boolean;
  courseCount: number;
}

// 단일 강의
export interface CourseItem {
  courseId: number;
  countryId: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  fileUrls: string[];
  level: string;
  levelName: string; // '초급', '중급', '고급'
  status: string;
}

// API 공통 응답 구조
export interface BaseApiResponse<T> {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: T;
}

// 단일 강의 상세 구조
export interface CourseDetailItem extends CourseItem {
  videoUrl?: string;
  instructor?: string;
  curriculum?: string[];
}

export interface CountryCourseResponse {
  country: Country | null;
  courses: CourseItem[];
}

// 난이도 타입 정의 및 색상
export type LevelType = '초급' | '중급' | '고급';

export const LEVEL_COLORS: Record<LevelType | string, string> = {
  초급: 'bg-[#4A6B6B]',
  중급: 'bg-[#D9A752]',
  고급: 'bg-[#C95B5B]',
  BEGINNER: "bg-[#4A6B6B]",
  INTERMEDIATE: "bg-[#D9A752]",
  ADVANCED: "bg-[#C95B5B]",
};

// 수강 후기 요약
export interface CourseReviewSummary {
  courseId: number;
  averageRating: number;
  totalReviewCount: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  fiveStarRate: number;
  fourStarRate: number;
  threeStarRate: number;
  twoStarRate: number;
  oneStarRate: number;
}