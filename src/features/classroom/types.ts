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

// 강의 아이템
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

// API 응답 구조
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

// 난이도 타입 정의 및 색상 매핑
export type LevelType = '초급' | '중급' | '고급';

export const LEVEL_COLORS: Record<LevelType | string, string> = {
  초급: 'bg-[#4A6B6B]',
  중급: 'bg-[#D9A752]',
  고급: 'bg-[#C95B5B]',
};