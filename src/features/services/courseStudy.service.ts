import { api, ApiResult, unwrapData } from "@/lib/api";

export interface CourseStudyChapter {
  chapterId: number;
  title: string;
  description: string;
  videoUrl: string | null;
  durationSeconds: number;
  chapterOrder: number;
  watchedSeconds: number;
  progressRate: number;
  completed: boolean;
  locked: boolean;
}

export interface CourseStudyDetail {
  courseId: number;
  title: string;
  accessExpiresAt: string;
  quizAvailable: boolean;
  courseProgressRate?: number;
  chapters: CourseStudyChapter[];
}

export interface ChapterProgress {
  progressId: number;
  userId: number;
  courseId: number;
  chapterId: number;
  watchedSeconds: number;
  progressRate: number;
  completed: boolean;
  nextChapterId: number | null;
  nextChapterUnlocked: boolean;
  courseProgressRate: number;
  quizAvailable: boolean;
}

export const getCourseStudyDetail = async (
  courseId: string | number,
  signal?: AbortSignal
): Promise<CourseStudyDetail> => {
  const response = await api.get<ApiResult<CourseStudyDetail>>(`/api/v1/my/courses/${courseId}`, {
    cache: "no-store",
    signal,
    suppressGlobalError: true,
  });

  const data = unwrapData(response);

  return {
    ...data,
    chapters: data.chapters ?? [],
  };
};

export const updateChapterProgress = async (
  courseId: string | number,
  chapterId: string | number,
  watchedSeconds: number
): Promise<ChapterProgress> => {
  const response = await api.post<ApiResult<ChapterProgress>>(`/api/v1/courses/${courseId}/chapters/${chapterId}/progress`,
    {
      watchedSeconds: Math.max(
        0,
        Math.floor(watchedSeconds)
      ),
    },
    {
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
};