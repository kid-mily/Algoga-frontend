import {
  getCourseStudyDetail,
  updateChapterProgress,
} from "@/features/services/courseStudy.service";
import type { CourseStudyChapter } from "./types";

export const sortChapters = (chapters: CourseStudyChapter[]) => {
  return [...chapters].sort((a, b) => a.chapterOrder - b.chapterOrder);
};

// 완료 판단은 백엔드 확정 플래그인 completed만 사용합니다.
// progressRate는 화면 표시용 퍼센트입니다.
export const isChapterCompleted = (chapter: CourseStudyChapter) => {
  return chapter.completed === true;
};

export const getFirstOpenChapter = (chapters: CourseStudyChapter[]) => {
  return (
    chapters.find((chapter, index) => {
      if (index === 0) return !chapter.locked;

      const previousChapter = chapters[index - 1];

      return !chapter.locked && previousChapter?.completed === true;
    }) ??
    chapters[0] ??
    null
  );
};

export const loadLectureStudy = async (
  courseId: string,
  signal?: AbortSignal
) => {
  const course = await getCourseStudyDetail(courseId, signal);
  const chapters = sortChapters(course.chapters ?? []);

  return {
    course,
    chapters,
    firstChapter: getFirstOpenChapter(chapters),
  };
};

export const saveChapterProgress = (
  courseId: string,
  chapterId: number,
  watchedSeconds: number
) => {
  return updateChapterProgress(courseId, chapterId, watchedSeconds);
};

export const formatDuration = (seconds?: number) => {
  if (!seconds) return "0분";
  return `${Math.ceil(seconds / 60)}분`;
};