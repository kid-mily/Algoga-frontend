"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import {
  isChapterCompleted,
  loadLectureStudy,
  saveChapterProgress,
  sortChapters,
} from "../actions";
import type {
  ChapterProgress,
  CourseStudyChapter,
  CourseStudyDetail,
} from "../types";

const SAVE_INTERVAL_SECONDS = 5;
const REFRESH_RETRY_COUNT = 3;
const REFRESH_RETRY_DELAY_MS = 500;

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export function useLectureStudy(courseId: string) {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastReportedSecondsRef = useRef(0);
  const latestWatchedSecondsRef = useRef(0);
  const selectedChapterRef = useRef<CourseStudyChapter | null>(null);

  const [course, setCourse] = useState<CourseStudyDetail | null>(null);
  const [selectedChapter, setSelectedChapter] =
    useState<CourseStudyChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const chapters = useMemo(() => {
    return sortChapters(course?.chapters ?? []);
  }, [course]);

  const totalProgress = useMemo(() => {
    if (typeof course?.courseProgressRate === "number") {
      return Math.min(Math.max(Math.round(course.courseProgressRate), 0), 100);
    }

    if (chapters.length === 0) return 0;

    const sum = chapters.reduce(
      (total, chapter) => total + (chapter.progressRate ?? 0),
      0
    );

    return Math.round(sum / chapters.length);
  }, [chapters, course?.courseProgressRate]);

  const canOpenChapter = (chapterIndex: number) => {
    if (chapterIndex === 0) return true;

    const chapter = chapters[chapterIndex];
    if (!chapter || chapter.locked) return false;

    const previousChapter = chapters[chapterIndex - 1];
    return previousChapter ? isChapterCompleted(previousChapter) : false;
  };

  const selectChapter = useCallback((chapter: CourseStudyChapter) => {
    setSelectedChapter(chapter);
    setIsPlaying(false);

    selectedChapterRef.current = chapter;
    lastReportedSecondsRef.current = chapter.watchedSeconds ?? 0;
    latestWatchedSecondsRef.current = chapter.watchedSeconds ?? 0;
  }, []);

  useEffect(() => {
    selectedChapterRef.current = selectedChapter;
  }, [selectedChapter]);

  const applyProgress = useCallback(
    (chapterId: number, progress: ChapterProgress) => {
      setCourse((previousCourse) => {
        if (!previousCourse) return previousCourse;

        return {
          ...previousCourse,
          courseProgressRate:
            typeof progress.courseProgressRate === "number"
              ? progress.courseProgressRate
              : previousCourse.courseProgressRate,
          quizAvailable:
            typeof progress.quizAvailable === "boolean"
              ? progress.quizAvailable
              : previousCourse.quizAvailable,
          chapters: previousCourse.chapters.map((chapter) => {
            if (chapter.chapterId !== chapterId) return chapter;

            return {
              ...chapter,
              watchedSeconds: progress.watchedSeconds,
              progressRate: progress.progressRate,
              completed: progress.completed,
            };
          }),
        };
      });

      setSelectedChapter((previousChapter) => {
        if (!previousChapter || previousChapter.chapterId !== chapterId) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          watchedSeconds: progress.watchedSeconds,
          progressRate: progress.progressRate,
          completed: progress.completed,
        };
      });
    },
    []
  );

  const refreshCourse = useCallback(async () => {
    const { course: refreshedCourse } = await loadLectureStudy(courseId);
    const refreshedChapters = sortChapters(refreshedCourse.chapters ?? []);

    setCourse(refreshedCourse);

    return refreshedChapters;
  }, [courseId]);

  const moveToNextChapterAfterCompleted = useCallback(
    async (currentChapterId: number, progress: ChapterProgress) => {
      const nextChapterId = progress.nextChapterId ?? null;

      const findNextChapter = (chapterList: CourseStudyChapter[]) => {
        if (nextChapterId) {
          return (
            chapterList.find((chapter) => chapter.chapterId === nextChapterId) ??
            null
          );
        }

        const currentIndex = chapterList.findIndex(
          (chapter) => chapter.chapterId === currentChapterId
        );

        if (currentIndex < 0) return null;

        return chapterList[currentIndex + 1] ?? null;
      };

      const optimisticNextChapter = findNextChapter(chapters);

      if (optimisticNextChapter?.videoUrl) {
        selectChapter({
          ...optimisticNextChapter,
          locked: false,
        });
        return;
      }

      for (let attempt = 0; attempt < REFRESH_RETRY_COUNT; attempt += 1) {
        if (attempt > 0) {
          await wait(REFRESH_RETRY_DELAY_MS);
        }

        const refreshedChapters = await refreshCourse();
        const nextChapter = findNextChapter(refreshedChapters);

        if (nextChapter?.videoUrl) {
          selectChapter({
            ...nextChapter,
            locked: false,
          });
          return;
        }
      }
    },
    [chapters, refreshCourse, selectChapter]
  );

  useEffect(() => {
    if (!courseId) return;

    const controller = new AbortController();

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const { course: fetchedCourse, firstChapter } = await loadLectureStudy(
          courseId,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setCourse(fetchedCourse);
        setSelectedChapter(firstChapter);
        selectedChapterRef.current = firstChapter;
        lastReportedSecondsRef.current = firstChapter?.watchedSeconds ?? 0;
        latestWatchedSecondsRef.current = firstChapter?.watchedSeconds ?? 0;
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("[study] 강의 학습 정보 조회 실패:", error);

        if (error instanceof ApiRequestError && error.status === 401) {
          router.replace("/auth/login");
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "강의 정보를 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchCourse();

    return () => {
      controller.abort();
    };
  }, [courseId, router]);

  const reportProgress = useCallback(
    async (watchedSeconds: number, force = false) => {
      const chapter = selectedChapterRef.current;

      if (!chapter || !courseId) return null;

      const seconds = Math.max(0, Math.floor(watchedSeconds));
      const difference = seconds - lastReportedSecondsRef.current;

      latestWatchedSecondsRef.current = seconds;

      if (!force && difference < SAVE_INTERVAL_SECONDS) {
        return null;
      }

      lastReportedSecondsRef.current = seconds;

      try {
        const progress = await saveChapterProgress(
          courseId,
          chapter.chapterId,
          seconds
        );

        applyProgress(chapter.chapterId, progress);

        return progress;
      } catch (error) {
        console.error("[study] 진도 업데이트 실패:", error);
        return null;
      }
    },
    [applyProgress, courseId]
  );

  const flushProgress = useCallback(async () => {
    const chapter = selectedChapterRef.current;
    if (!chapter || !courseId) return;

    const currentTime = videoRef.current?.currentTime;
    const watchedSeconds =
      typeof currentTime === "number" && Number.isFinite(currentTime)
        ? currentTime
        : latestWatchedSecondsRef.current;

    const seconds = Math.max(0, Math.floor(watchedSeconds));
    if (seconds <= 0) return;

    latestWatchedSecondsRef.current = seconds;
    lastReportedSecondsRef.current = seconds;

    try {
      const progress = await saveChapterProgress(
        courseId,
        chapter.chapterId,
        seconds
      );

      applyProgress(chapter.chapterId, progress);
    } catch (error) {
      console.error("[study] 마지막 진도 저장 실패:", error);
    }
  }, [applyProgress, courseId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void flushProgress();
      }
    };

    const handleBeforeUnload = () => {
      void flushProgress();
    };

    const handlePageHide = () => {
      void flushProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      void flushProgress();

      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [flushProgress]);

  const handleChapterSelect = async (
    chapter: CourseStudyChapter,
    chapterIndex: number
  ) => {
    if (!canOpenChapter(chapterIndex)) return;
    if (selectedChapterRef.current?.chapterId === chapter.chapterId) return;

    await flushProgress();
    selectChapter(chapter);
  };

  const handleVideoEnded = async (currentTime: number) => {
    setIsPlaying(false);

    const currentChapter = selectedChapterRef.current;
    if (!currentChapter || !courseId) return;

    const duration = videoRef.current?.duration;

    const endedSeconds =
      typeof duration === "number" && Number.isFinite(duration)
        ? duration
        : currentTime;

    const progress = await reportProgress(endedSeconds, true);

    if (!progress) return;

    await refreshCourse();

    if (!progress.completed) return;

    await moveToNextChapterAfterCompleted(currentChapter.chapterId, progress);
  };

  return {
    videoRef,
    course,
    chapters,
    selectedChapter,
    isLoading,
    isPlaying,
    errorMessage,
    totalProgress,
    canOpenChapter,
    setIsPlaying,
    reportProgress,
    flushProgress,
    handleChapterSelect,
    handleVideoEnded,
  };
}