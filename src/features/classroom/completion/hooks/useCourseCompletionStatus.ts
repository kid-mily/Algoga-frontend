"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyCourses,
  isMyCourseCompleted,
} from "@/features/services/myCourse.service";

export function useCourseCompletionStatus(courseId: string) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reviewWritten, setReviewWritten] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkCompletion = useCallback(async () => {
    if (!courseId) {
      setIsCompleted(false);
      setQuizSubmitted(false);
      setReviewWritten(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const courses = await getMyCourses(0, 100);

      const currentCourse = courses.content.find(
        (course) => String(course.courseId) === String(courseId)
      );

      setQuizSubmitted(currentCourse?.quizSubmitted === true);
      setReviewWritten(currentCourse?.reviewWritten === true);
      setIsCompleted(isMyCourseCompleted(currentCourse));
    } catch (error) {
      console.error("[course-completion] 이수 상태 조회 실패:", error);

      setQuizSubmitted(false);
      setReviewWritten(false);
      setIsCompleted(false);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void checkCompletion();

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
    reviewWritten,
    isLoading,
    refresh: checkCompletion,
  };
}