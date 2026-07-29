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

// 강의자료 파일 (원본 파일명 포함)
export interface CourseFile {
  fileUrl: string;
  originalFileName: string | null;
  fileOrder: number;
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
  files?: CourseFile[];
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

// 진도율 업데이트 요청 Body 구조
export interface UpdateProgressRequest {
  watchedSeconds: number; // 시청 시간 (초)
}

// 진도율 업데이트 완료 시 백엔드가 주는 응답 데이터 구조
export interface ProgressData {
  progressId: number;
  userId: number;
  courseId: number;
  chapterId: number;
  watchedSeconds: number;
  progressRate: number;   // 진도율 (예: 80)
  completed: boolean;     // 완료 여부 (true/false)
}

// 커리큘럼 조회용 비디오 타입에 chapterId를 추적할 수 있도록 연동
export interface VideoItem {
  videoId: number;
  chapterId: number; // 챕터 ID 추적
  title: string;
  videoUrl: string;
  description: string;
  uploadDate?: string;
}

export interface ChapterItem {
  chapterId: number;
  chapterTitle: string;
  videos: VideoItem[];
}

// 챕터별 영상 단건 구조
export interface VideoItem {
  videoId: number;
  chapterId: number;       // 진도율 전송 시 매핑할 부모 챕터 ID
  title: string;
  videoUrl: string;
  description: string;
  duration?: string;       // UI 표기용 재생 시간 (예: "15:20")
  uploadDate?: string;
}

// 챕터 목록 구조
export interface ChapterItem {
  chapterId: number;
  chapterTitle: string;    
  chapterNumber?: string;
  progressRate?: number;   // 이 챕터의 진도율
  completed?: boolean;     // 이 챕터 완료 여부
  videos: VideoItem[];
}

// 진도율 업데이트 요청 Body 구조
export interface UpdateProgressRequest {
  watchedSeconds: number;
}

// 진도율 업데이트 완료 시 백엔드가 주는 응답 데이터 구조
export interface ProgressData {
  progressId: number;
  userId: number;
  courseId: number;
  chapterId: number;
  watchedSeconds: number;
  progressRate: number;     // 0 ~ 100
  completed: boolean;
}

export interface StudyChapter {
  chapterId: number;
  title: string;
  videoUrl: string;
  durationSeconds: number;
  chapterOrder: number;
  progressRate?: number;
  completed?: boolean;
  watchedSeconds?: number;
}
