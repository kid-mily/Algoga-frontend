//adminAuth.service.ts

export interface AdminCourse {
  courseId: number;
  countryId: number;
  managerId?: number;
  title: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string | null;
  fileUrls?: string[];
  level?: string;
  levelName?: string;
  status?: string;
  countryName?: string;
  isPublic?: boolean;
  studentCount?: number;
  chapterCount?: number;
  createdAt?: string;
}

export interface CourseCountry {
  countryId: number;
  countryName: string;
  countryCode?: string;
  continentCode?: string;
  continentName?: string;
}

//adminAuth.service.ts
export interface AdminLoginRequest {
  loginId: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken?: string;
}


export interface CreateAdminCoursePayload {
  countryId: number;
  title: string;
  description: string;
  price: number;
  level: string;
  status?: string; 
  thumbnail: File;
  files?: File[];
}

// adminChapter.service.ts
export interface AdminChapter {
  chapterId: number;
  courseId?: number;
  title: string;
  durationSeconds: number;
  chapterOrder: number;
  videoUrl?: string;
}

export interface CreateAdminChapterPayload {
  courseId: number;
  title: string;
  description: string;
  durationSeconds: number;
  chapterOrder: number;
  video: File;
}

export interface AdminQuiz {
  quizId: number;
  courseId: number;
  lectureTitle?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation?: string;
}

export interface CreateAdminQuizPayload {
  courseId: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation?: string;
}

export interface UpdateAdminQuizPayload {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation?: string;
}

// adminCoupon.service.ts
export interface AdminCoupon {
  couponPolicyId: number;
  courseId: number;
  managerId?: number;
  couponName: string;
  discountType: "RATE" | "AMOUNT" | string; // RATE(비율/퍼센트) 또는 AMOUNT(정액/원)
  discountValue: number;
  validDays: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 쿠폰 등록 및 수정 시 백엔드로 보낼 데이터 타입
export interface AdminCouponPayload {
  courseId: number;
  couponName: string;
  discountType: string;
  discountValue: number;
  validDays: number;
  active: boolean;
}

// 수강생 조회
export interface Student {
  userId: number;
  userName: string;
  email: string;
  enrolledAt: string; // 수강 시작일 등
}

// 수강생 조회
export interface Student {
  userId: number;
  userName: string;
  email: string;
  enrolledAt: string; // 수강 시작일 등
}
