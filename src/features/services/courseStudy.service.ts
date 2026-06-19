import { api, ApiResponse } from "@/lib/api";

export interface CourseStudyChapter {
  chapterId: number;
  title: string;
  videoUrl: string;
  durationSeconds: number;
  chapterOrder: number;
  progressRate?: number;
  completed?: boolean;
  watchedSeconds?: number;
  locked?: boolean;
}

export interface CourseStudyDetail {
  courseId: number;
  title: string;
  description?: string;
  accessExpiresAt?: string;
  quizAvailable?: boolean;
  isEnrolled: boolean;
  isPaid: boolean;
  chapters: CourseStudyChapter[];
}

type CourseStudyDetailResponse = CourseStudyDetail & {
  enrolled?: boolean;
  paid?: boolean;
  purchased?: boolean;
};

export interface ChapterProgress {
  progressId: number;
  userId: number;
  courseId: number;
  chapterId: number;
  watchedSeconds: number;
  progressRate: number;
  completed: boolean;
}

export const getCourseStudyDetail = async (
  courseId: string | number,
  signal?: AbortSignal
): Promise<CourseStudyDetail> => {
  const response = await api.get<ApiResponse<CourseStudyDetail>>(
    `/api/v1/my/courses/${courseId}`,
    {
      cache: "no-store",
      signal,
      suppressGlobalError: true,
    }
  );

  const data = response.data as CourseStudyDetailResponse;

  return {
    ...data,
    isEnrolled: Boolean(data.isEnrolled ?? data.enrolled ?? true),
    isPaid: Boolean(data.isPaid ?? data.paid ?? data.purchased ?? true),
    chapters: data.chapters ?? [],
  };
};

export const updateChapterProgress = async (
  courseId: string | number,
  chapterId: string | number,
  watchedSeconds: number
): Promise<ChapterProgress> => {
  const response = await api.post<ApiResponse<ChapterProgress>>(
    `/api/v1/courses/${courseId}/chapters/${chapterId}/progress`,
    {
      watchedSeconds: Math.floor(watchedSeconds),
    },
    {
      suppressGlobalError: true,
    }
  );

  return response.data;
};
