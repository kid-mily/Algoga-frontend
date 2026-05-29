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


// 기존에 있던 CourseItem
export interface CourseItem {
  courseId: number;
  countryId: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  fileUrls: string[];
  level: string;
  levelName: string;
  status: string;
}

// 단일 강의 상세 
export interface CourseItemProps {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: CourseDetailItem; // 배열 아님
}

export interface CourseDetailItem extends CourseItem {
  videoUrl?: string;      // 강의 영상 링크
  instructor?: string;    // 강사 이름
  curriculum?: string[];  // 목차 또는 커리큘럼
}