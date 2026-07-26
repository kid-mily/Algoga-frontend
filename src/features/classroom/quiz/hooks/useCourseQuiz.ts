"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { CourseStudyChapter } from "@/features/services/courseStudy.service";
import { submitCourseQuiz } from "@/features/services/courseQuiz.service";
import { createQuizAnswers, type CourseQuizLoadResult } from "../actions";
import type { CourseQuiz, CourseQuizSubmitResult } from "../types";

// 초기 데이터는 서버 컴포넌트(quiz/page.tsx)에서 미리 조회해 내려준다.
export function useCourseQuiz(
  courseId: string,
  completeHref: string,
  initialData: CourseQuizLoadResult
) {
  const router = useRouter();

  const [courseTitle] = useState(initialData.courseTitle);
  const [chapters] = useState<CourseStudyChapter[]>(initialData.chapters);
  const [quizzes] = useState<CourseQuiz[]>(initialData.quizzes);
  const [submitResult, setSubmitResult] =
    useState<CourseQuizSubmitResult | null>(null);
  const [canTakeQuiz] = useState(initialData.canTakeQuiz);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialData.errorMessage);

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
    if (!currentQuiz || submitResult) return;
    if (option < 1 || option > 4) return;

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
    if (!currentQuiz || submitResult || isSubmitting) return;

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
    isSubmitting,
    errorMessage,
    canTakeQuiz,
    selectAnswer,
    previous,
    nextOrSubmit,
  };
}