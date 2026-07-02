"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { submitDiagnosisResult } from "@/features/services/evaluation.service";
import { buildDiagnosisResultPayload } from "../actions";
import { DIAGNOSIS_ATTEMPT_STORAGE_KEY, DIAGNOSIS_RESULT_STORAGE_KEY, PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY } from "../types";
import { DiagnosisOption, EvaluationAnswer, EvaluationFormQuestion } from "../types";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  const pathContinentCode = continentCode.trim().toLowerCase();

  const currentQuestion = questions[step] ?? null;

  // 현재 문항에서 선택한 답안
  const selectedAnswer = currentQuestion
    ? answers.find((ans) => ans.questionId === currentQuestion.questionId)
        ?.selectedOption ?? null
    : null;

  const isLast = questions.length > 0 && step === questions.length - 1;

  // 모든 문항 답변 여부
  const isAllAnswered =
    questions.length > 0 &&
    questions.every((question) =>
      answers.some((ans) => ans.questionId === question.questionId)
    );

  // 진행률
  const progress =
    questions.length > 0
      ? Math.round(((step + 1) / questions.length) * 100)
      : 0;

  // 답안 선택
  const handleSelectAnswer = (selectedOption: number) => {
    if (!currentQuestion || selectedOption < 1 || selectedOption > 4) return;

    const validOption = selectedOption as DiagnosisOption;

    setAnswers((prev) => {
      const remaining = prev.filter(
        (ans) => ans.questionId !== currentQuestion.questionId
      );

      return [
        ...remaining,
        {
          questionId: currentQuestion.questionId,
          selectedOption: validOption,
        },
      ];
    });

    setSubmitErrorMessage("");
  };

  // 이전 문제
  const handlePrev = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  // 다음 문제 또는 제출 모달 열기
  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (isLast) {
      setIsCompleteModalOpen(true);
      return;
    }

    setStep((current) => Math.min(current + 1, questions.length - 1));
  };

  // 진단평가 제출
  const handleSubmitResult = async () => {
    const payload = buildDiagnosisResultPayload({
      countryId,
      questions,
      answers,
    });

    if (!payload) {
      setIsCompleteModalOpen(false);
      setSubmitErrorMessage("모든 문항에 답한 후 제출해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitErrorMessage("");

      const result = await submitDiagnosisResult(payload);

      // 결과 페이지에서 문항 정보까지 함께 사용할 수 있도록 저장
      sessionStorage.setItem(
        DIAGNOSIS_ATTEMPT_STORAGE_KEY,
        JSON.stringify({
          result,
          questions,
        })
      );

      // 기존 데이터와의 호환성을 위해 유지
      sessionStorage.setItem(
        DIAGNOSIS_RESULT_STORAGE_KEY,
        JSON.stringify(result)
      );

      setIsCompleteModalOpen(false);

      router.replace(`/classroom/${pathContinentCode}/${countryId}/evaluation/result`);
    } catch (error) {
      console.error("[diagnosis] 진단평가 제출 실패:", error);

      // 로그인 만료 시 현재 제출 데이터 임시 저장
      if (error instanceof ApiRequestError && error.status === 401) {
        sessionStorage.setItem(
          PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY,
          JSON.stringify({
            continentCode: pathContinentCode,
            countryId,
            payload,
          })
        );

        const redirectUrl = `/classroom/${pathContinentCode}/${countryId}/evaluation`;

        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
        return;
      }

      setSubmitErrorMessage(
        error instanceof Error
          ? error.message
          : "진단평가 제출에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCompleteModal = () => {
    if (isSubmitting) return;

    setIsCompleteModalOpen(false);
  };

  return {
    step,
    currentQuestion,
    selectedAnswer,
    isLast,
    isAllAnswered,
    progress,
    isCompleteModalOpen,
    isSubmitting,
    submitErrorMessage,
    handleSelectAnswer,
    handlePrev,
    handleNext,
    handleSubmitResult,
    closeCompleteModal,
  };
}