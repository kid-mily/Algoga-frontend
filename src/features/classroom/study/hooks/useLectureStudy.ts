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

  const selectChapter = (chapter: CourseStudyChapter) => {
    setSelectedChapter(chapter);
    setIsPlaying(false);
    selectedChapterRef.current = chapter;
    lastReportedSecondsRef.current = chapter.watchedSeconds ?? 0;
    latestWatchedSecondsRef.current = chapter.watchedSeconds ?? 0;
  };

  useEffect(() => {
    selectedChapterRef.current = selectedChapter;
  }, [selectedChapter]);

  const refreshCourseAfterProgress = async (progress: ChapterProgress) => {
    const { course: refreshedCourse } = await loadLectureStudy(courseId);

    const refreshedChapters = sortChapters(refreshedCourse.chapters ?? []);
    const mergedChapters = refreshedChapters.map((chapter) => {
      if (chapter.chapterId !== progress.chapterId) return chapter;

      return {
        ...chapter,
        watchedSeconds: progress.watchedSeconds,
        progressRate: progress.progressRate,
        completed: progress.completed,
      };
    });

    const nextCourse: CourseStudyDetail = {
      ...refreshedCourse,
      courseProgressRate:
        typeof progress.courseProgressRate === "number"
          ? progress.courseProgressRate
          : refreshedCourse.courseProgressRate,
      quizAvailable:
        typeof progress.quizAvailable === "boolean"
          ? progress.quizAvailable
          : refreshedCourse.quizAvailable,
      chapters: mergedChapters,
    };

    setCourse(nextCourse);

    return {
      course: nextCourse,
      chapters: mergedChapters,
    };
  };

  const findNextChapterFromCurrentState = (chapterId: number) => {
    const currentIndex = chapters.findIndex(
      (chapter) => chapter.chapterId === chapterId
    );

    if (currentIndex < 0) return null;

    return chapters[currentIndex + 1] ?? null;
  };

  const moveToNextChapter = async (progress: ChapterProgress) => {
    try {
      const optimisticNextChapter = findNextChapterFromCurrentState(
        progress.chapterId
      );

      if (optimisticNextChapter?.videoUrl && progress.completed) {
        selectChapter({
          ...optimisticNextChapter,
          locked: false,
        });
        return;
      }

      for (let attempt = 0; attempt < 5; attempt += 1) {
        if (attempt > 0) {
          await wait(700);
        }

        const refreshed = await refreshCourseAfterProgress(progress);

        const currentIndex = refreshed.chapters.findIndex(
          (chapter) => chapter.chapterId === progress.chapterId
        );

        const nextChapter =
          currentIndex >= 0 ? refreshed.chapters[currentIndex + 1] : null;

        if (!nextChapter?.videoUrl) continue;

        if (!nextChapter.locked || progress.completed) {
          selectChapter({
            ...nextChapter,
            locked: false,
          });
          return;
        }
      }
    } catch (error) {
      console.error("[study] 다음 챕터 자동 이동 실패:", error);
    }
  };

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

  const reportProgress = async (
    watchedSeconds: number,
    force = false
  ): Promise<ChapterProgress | null> => {
    if (!selectedChapter || !courseId) return null;

    const seconds = Math.floor(watchedSeconds);
    const difference = seconds - lastReportedSecondsRef.current;

    latestWatchedSecondsRef.current = seconds;

    if (!force && difference < 5) return null;

    lastReportedSecondsRef.current = seconds;

    try {
      const progress = await saveChapterProgress(
        courseId,
        selectedChapter.chapterId,
        seconds
      );

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
            if (chapter.chapterId !== selectedChapter.chapterId) {
              return chapter;
            }

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
        if (!previousChapter) return previousChapter;

        if (previousChapter.chapterId !== selectedChapter.chapterId) {
          return previousChapter;
        }

        return {
          ...previousChapter,
          watchedSeconds: progress.watchedSeconds,
          progressRate: progress.progressRate,
          completed: progress.completed,
        };
      });

      return progress;
    } catch (error) {
      console.error("[study] 진도 업데이트 실패:", error);
      return null;
    }
  };

  const flushProgress = useCallback(async () => {
    const chapter = selectedChapterRef.current;
    if (!chapter || !courseId) return;

    const currentTime = videoRef.current?.currentTime;
    const watchedSeconds =
      typeof currentTime === "number" && Number.isFinite(currentTime)
        ? currentTime
        : latestWatchedSecondsRef.current;

    const seconds = Math.floor(watchedSeconds);
    if (seconds <= 0) return;

    latestWatchedSecondsRef.current = seconds;
    lastReportedSecondsRef.current = seconds;

    await saveChapterProgress(courseId, chapter.chapterId, seconds).catch(
      (error) => {
        console.error("[study] 마지막 진도 저장 실패:", error);
      }
    );
  }, [courseId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void flushProgress();
      }
    };

    const handleBeforeUnload = () => {
      void flushProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      void flushProgress();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [flushProgress]);

  const handleChapterSelect = async (
    chapter: CourseStudyChapter,
    chapterIndex: number
  ) => {
    if (!canOpenChapter(chapterIndex)) return;

    if (selectedChapter?.chapterId === chapter.chapterId) return;

    const currentTime = videoRef.current?.currentTime;

    if (typeof currentTime === "number" && Number.isFinite(currentTime)) {
      await reportProgress(currentTime, true);
    } else {
      await flushProgress();
    }

    selectChapter(chapter);
  };

  const handleVideoEnded = async (currentTime: number) => {
    setIsPlaying(false);

    const duration = videoRef.current?.duration;
    const endedSeconds =
      typeof duration === "number" && Number.isFinite(duration)
        ? Math.max(currentTime, duration)
        : currentTime;

    const progress = await reportProgress(endedSeconds, true);

    if (progress?.completed) {
      await moveToNextChapter(progress);
    }
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