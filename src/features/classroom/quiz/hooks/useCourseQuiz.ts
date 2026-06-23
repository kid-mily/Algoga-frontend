"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { CourseStudyChapter, getCourseStudyDetail } from "@/features/services/courseStudy.service";
import { getCourseQuizzes, submitCourseQuiz } from "@/features/services/courseQuiz.service";
import { areAllChaptersCompleted } from "../../learning/actions";
import { createQuizAnswers } from "../actions";
import type { CourseQuiz, CourseQuizAttempt, CourseQuizSubmitResult } from "../types";

export function useCourseQuiz(
  courseId: string,
  completeHref: string,
  initialCourseTitle: string
) {
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState(initialCourseTitle);
  const [chapters, setChapters] = useState<CourseStudyChapter[]>([]);
  const [quizzes, setQuizzes] = useState<CourseQuiz[]>([]);
  const [submitResult, setSubmitResult] = useState<CourseQuizSubmitResult | null>(null);

  //  UI 및 퀴즈 진행 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 데이터 패칭 및 에러 핸들링
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

        // 1. 강의 정보 조회
        const course = await getCourseStudyDetail(courseId, controller.signal);
        if (controller.signal.aborted) return;

        // 챕터 정렬
        const orderedChapters = [...course.chapters].sort(
          (a, b) => a.chapterOrder - b.chapterOrder
        );
        setCourseTitle(course.title);
        setChapters(orderedChapters);

        // 2. 학습 완료 여부 검증
        if (!areAllChaptersCompleted(orderedChapters)) {
          setErrorMessage("모든 챕터를 완료한 후 퀴즈를 풀 수 있습니다.");
          return;
        }

        // 3. 퀴즈 목록 조회
        const quizList = await getCourseQuizzes(courseId);
        if (controller.signal.aborted) return;

        if (quizList.length === 0) {
          setErrorMessage("등록된 퀴즈가 없습니다.");
          return;
        }

        setQuizzes(quizList);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("[quiz] 퀴즈 조회 실패:", error);

        // API 에러 세부 분기 처리
        if (error instanceof ApiRequestError) {
          switch (error.status) {
            case 401:
              router.replace("/auth/login");
              return;
            case 400:
              setErrorMessage("모든 챕터를 완료한 후 퀴즈를 풀 수 있습니다.");
              return;
            case 403:
              setErrorMessage("수강 등록된 강의가 아닙니다.");
              return;
            case 404:
              setErrorMessage("등록된 퀴즈가 없습니다.");
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

    loadQuizData();

    return () => controller.abort();
  }, [courseId, router]);

  const currentQuiz = quizzes[currentIndex] ?? null;
  const isReviewing = submitResult !== null;

  // 채점 정보 연산
  const currentWrongAnswer = currentQuiz && submitResult
    ? submitResult.wrongAnswers.find((answer) => answer.quizId === currentQuiz.quizId)
    : undefined;

  const submittedOption = currentQuiz ? selectedAnswers[currentQuiz.quizId] : undefined;

  const correctOption = submitResult
    ? currentWrongAnswer?.correctOption ?? submittedOption
    : undefined;

  // --- Actions ---

  // 답안 선택
  const selectAnswer = (option: number) => {
    if (!currentQuiz || submitResult) return;
    if (option < 1 || option > 4) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuiz.quizId]: option,
    }));
    setErrorMessage("");
  };

  // 이전 문제 이동
  const previous = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    setErrorMessage("");
  };

  // 다음 문제 이동 또는 최종 제출
  const nextOrSubmit = async () => {
    if (!currentQuiz || submitResult || isSubmitting) return;

    // 미선택 상태 방어 코드
    if (!selectedAnswers[currentQuiz.quizId]) {
      setErrorMessage("답안을 선택해 주세요.");
      return;
    }

    // 다음 문제로 이동 가능할 때
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setErrorMessage("");
      return;
    }

    // 최종 제출 데이터 포맷팅
    const answers = createQuizAnswers(quizzes, selectedAnswers);
    if (!answers) {
      setErrorMessage("등록된 모든 문제에 한 번씩 답해야 합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await submitCourseQuiz(
        courseId,
        answers
      );

      const attempt: CourseQuizAttempt = {
        result,
        quizzes,
        selectedAnswers,
      };

      // POST 성공 시 백엔드 DB 저장 완료
      setSubmitResult(result);

      // DB 조회 실패 시 제출 직후 결과를 복구하기 위한 보조 데이터입니다.
      sessionStorage.setItem(
        `quiz-attempt-${courseId}`,
        JSON.stringify(attempt)
      );

      // 결과 페이지는 GET API로 DB 결과를 다시 조회
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
