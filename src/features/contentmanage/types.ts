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
