"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import {
  CourseStudyChapter,
  getCourseStudyDetail,
} from "@/features/services/courseStudy.service";
import {
  getCourseQuizzes,
  submitCourseQuiz,
} from "@/features/services/courseQuiz.service";
import { areAllChaptersCompleted } from "../../learning/actions";
import { createQuizAnswers } from "../actions";
import type { CourseQuiz, CourseQuizSubmitResult } from "../types";

export function useCourseQuiz(
  courseId: string,
  completeHref: string,
  initialCourseTitle: string
) {
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState(initialCourseTitle);
  const [chapters, setChapters] = useState<CourseStudyChapter[]>([]);
  const [quizzes, setQuizzes] = useState<CourseQuiz[]>([]);
  const [submitResult, setSubmitResult] =
    useState<CourseQuizSubmitResult | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!courseId) {
      queueMicrotask(() => {
        setErrorMessage("강의 번호가 올바르지 않습니다.");
        setIsLoading(false);
      });
      return;
    }

    const controller = new AbortController();

    const loadQuizData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const course = await getCourseStudyDetail(courseId, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        const orderedChapters = [...course.chapters].sort(
          (a, b) => a.chapterOrder - b.chapterOrder
        );

        setCourseTitle(course.title);
        setChapters(orderedChapters);

        if (!areAllChaptersCompleted(orderedChapters)) {
          setErrorMessage("모든 챕터를 완료해야 퀴즈를 풀 수 있습니다.");
          return;
        }

        const quizList = await getCourseQuizzes(courseId);

        if (controller.signal.aborted) {
          return;
        }

        if (quizList.length === 0) {
          setErrorMessage("등록된 퀴즈가 없습니다.");
          return;
        }

        setQuizzes(quizList);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("[quiz] 퀴즈 조회 실패:", error);

        if (error instanceof ApiRequestError) {
          switch (error.status) {
            case 401:
              router.replace("/auth/login");
              return;
            case 400:
              setErrorMessage("모든 챕터를 완료해야 퀴즈를 풀 수 있습니다.");
              return;
            case 403:
              setErrorMessage("수강 등록된 강의가 아닙니다.");
              return;
            case 404:
              setErrorMessage("등록된 퀴즈가 없거나 강의를 찾을 수 없습니다.");
              return;
            default:
              setErrorMessage(error.message);
              return;
          }
        }

        setErrorMessage("퀴즈를 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadQuizData();

    return () => {
      controller.abort();
    };
  }, [courseId, router]);

  const currentQuiz = quizzes[currentIndex] ?? null;
  const isReviewing = submitResult !== null;

  const currentWrongAnswer =
    currentQuiz && submitResult
      ? submitResult.wrongAnswers.find(
          (answer) => answer.quizId === currentQuiz.quizId
        )
      : undefined;

  const submittedOption = currentQuiz
    ? selectedAnswers[currentQuiz.quizId]
    : undefined;

  const correctOption = submitResult
    ? currentWrongAnswer?.correctOption ?? submittedOption
    : undefined;

  const selectAnswer = (option: number) => {
    if (!currentQuiz || submitResult) {
      return;
    }

    if (option < 1 || option > 4) {
      return;
    }

    setSelectedAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuiz.quizId]: option,
    }));

    setErrorMessage("");
  };

  const previous = () => {
    setCurrentIndex((previousIndex) => Math.max(0, previousIndex - 1));
    setErrorMessage("");
  };

  const nextOrSubmit = async () => {
    if (!currentQuiz || submitResult || isSubmitting) {
      return;
    }

    if (!selectedAnswers[currentQuiz.quizId]) {
      setErrorMessage("답안을 선택해 주세요.");
      return;
    }

    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((previousIndex) => previousIndex + 1);
      setErrorMessage("");
      return;
    }

    const answers = createQuizAnswers(quizzes, selectedAnswers);

    if (!answers) {
      setErrorMessage("등록된 모든 문제에 답해야 제출할 수 있습니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await submitCourseQuiz(courseId, answers);
      setSubmitResult(result);

      if (result.courseCompleted) {
        localStorage.setItem(`course-completed-${courseId}`, "true");
        window.dispatchEvent(new CustomEvent("course-completion-changed"));
        window.dispatchEvent(new CustomEvent("learning-benefits-updated"));
      }

      router.replace(completeHref);
    } catch (error) {
      console.error("[quiz] 퀴즈 제출 실패:", error);

      if (error instanceof ApiRequestError) {
        if (error.status === 401) {
          router.replace("/auth/login");
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("퀴즈 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    courseTitle,
    chapters,
    quizzes,
    currentQuiz,
    currentIndex,
    selectedAnswers,
    submitResult,
    currentWrongAnswer,
    correctOption,
    isReviewing,
    isLoading,
    isSubmitting,
    errorMessage,
    selectAnswer,
    previous,
    nextOrSubmit,
  };
}