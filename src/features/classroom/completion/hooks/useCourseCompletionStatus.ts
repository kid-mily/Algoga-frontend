"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyCourses,
  isMyCourseCompleted,
} from "@/features/services/myCourse.service";

export function useCourseCompletionStatus(
  courseId: string
) {
  const [isCompleted, setIsCompleted] =
    useState(false);
  const [quizSubmitted, setQuizSubmitted] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkCompletion = useCallback(async () => {
    if (!courseId) {
      setIsCompleted(false);
      setQuizSubmitted(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 수료 직후 API 반영 전 화면 이동을 위한 보조 상태입니다.
      const localCompleted =
        localStorage.getItem(
          `course-completed-${courseId}`
        ) === "true";

      const courses = await getMyCourses();
      const currentCourse = courses.find(
        (course) =>
          String(course.courseId) === String(courseId)
      );

      const serverCompleted =
        isMyCourseCompleted(currentCourse);

      setQuizSubmitted(
        currentCourse?.quizSubmitted === true
      );

      setIsCompleted(
        serverCompleted || localCompleted
      );

      if (serverCompleted) {
        localStorage.setItem(
          `course-completed-${courseId}`,
          "true"
        );
      }
    } catch (error) {
      console.error(
        "[course-completion] 수료 상태 조회 실패:",
        error
      );

      // 조회 실패 시 같은 브라우저에 저장된 상태를 사용합니다.
      setIsCompleted(
        localStorage.getItem(
          `course-completed-${courseId}`
        ) === "true"
      );
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    queueMicrotask(() => {
      void checkCompletion();
    });

    const handleCompletionChanged = () => {
      void checkCompletion();
    };

    window.addEventListener(
      "course-completion-changed",
      handleCompletionChanged
    );

    return () => {
      window.removeEventListener(
        "course-completion-changed",
        handleCompletionChanged
      );
    };
  }, [checkCompletion]);

  return {
    isCompleted,
    quizSubmitted,
    isLoading,
    refresh: checkCompletion,
  };
}
