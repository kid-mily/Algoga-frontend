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

export interface AdminChapter {
  chapterId: number;
  courseId?: number;
  title: string;
  description?: string;
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

export interface Student {
  userId: number;
  userName: string;
  email: string;
  enrolledAt: string;
}
