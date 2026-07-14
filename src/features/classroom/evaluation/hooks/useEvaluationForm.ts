"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { submitDiagnosisResult } from "@/features/services/evaluation.service";
import { buildDiagnosisResultPayload } from "../actions";
import type {
  DiagnosisOption,
  EvaluationAnswer,
  EvaluationFormQuestion,
} from "../types";

interface UseEvaluationFormParams {
  continentCode: string;
  countryId: string;
  questions: EvaluationFormQuestion[];
}

export function useEvaluationForm({
  continentCode,
  countryId,
  questions,
}: UseEvaluationFormParams) {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<EvaluationAnswer[]>([]);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  const pathContinentCode = continentCode.trim().toLowerCase();

  // 로그인 후 다시 돌아올 진단평가 주소
  const evaluationHref = useMemo(
    () => `/classroom/${pathContinentCode}/${countryId}/evaluation`,
    [pathContinentCode, countryId]
  );

  const loginHref = useMemo(
    () => `/auth/login?redirect=${encodeURIComponent(evaluationHref)}`,
    [evaluationHref]
  );

  const currentQuestion = questions[step] ?? null;

  const selectedAnswer = currentQuestion
    ? answers.find((answer) => answer.questionId === currentQuestion.questionId)
        ?.selectedOption ?? null
    : null;

  const isLast = questions.length > 0 && step === questions.length - 1;

  const isAllAnswered =
    questions.length > 0 &&
    questions.every((question) =>
      answers.some((answer) => answer.questionId === question.questionId)
    );

  const progress =
    questions.length > 0
      ? Math.round(((step + 1) / questions.length) * 100)
      : 0;

  const handleSelectAnswer = (selectedOption: number) => {
    if (!currentQuestion || selectedOption < 1 || selectedOption > 4) return;

    const validOption = selectedOption as DiagnosisOption;

    setAnswers((prevAnswers) => {
      const otherAnswers = prevAnswers.filter(
        (answer) => answer.questionId !== currentQuestion.questionId
      );

      return [
        ...otherAnswers,
        {
          questionId: currentQuestion.questionId,
          selectedOption: validOption,
        },
      ];
    });

    setSubmitErrorMessage("");
  };

  const handlePrev = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (isLast) {
      setIsCompleteModalOpen(true);
      return;
    }

    setStep((current) => Math.min(current + 1, questions.length - 1));
  };

  const handleSubmitResult = async () => {
    const payload = buildDiagnosisResultPayload({
      countryId,
      questions,
      answers,
    });

    if (!payload) {
      setIsCompleteModalOpen(false);
      setSubmitErrorMessage("모든 문항에 답변한 뒤 제출해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitErrorMessage("");

      // 결과는 sessionStorage에 저장하지 않고, 결과 페이지에서 백 API로 다시 조회한다.
      const result = await submitDiagnosisResult(payload);

      setIsCompleteModalOpen(false);

      router.replace(
        `/classroom/${pathContinentCode}/${countryId}/evaluation/result?resultId=${result.resultId}`
      );
    } catch (error) {
      console.error("[diagnosis] 진단평가 제출 실패:", error);

      if (error instanceof ApiRequestError && error.status === 401) {
        setIsCompleteModalOpen(false);
        setIsLoginModalOpen(true);
        return;
      }

      if (error instanceof ApiRequestError && error.status && error.status >= 500) {
        setSubmitErrorMessage(
          "잠시 후 다시 시도해 주세요. 진단평가 결과를 저장하지 못했습니다."
        );
        return;
      }

      setSubmitErrorMessage(
        error instanceof Error
          ? error.message
          : "진단평가 결과를 저장하지 못했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCompleteModal = () => {
    if (isSubmitting) return;
    setIsCompleteModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const goToLogin = () => {
    setIsLoginModalOpen(false);
    router.push(loginHref);
  };

  return {
    step,
    currentQuestion,
    selectedAnswer,
    isLast,
    isAllAnswered,
    progress,
    isCompleteModalOpen,
    isLoginModalOpen,
    isSubmitting,
    submitErrorMessage,
    handleSelectAnswer,
    handlePrev,
    handleNext,
    handleSubmitResult,
    closeCompleteModal,
    closeLoginModal,
    goToLogin,
  };
}
