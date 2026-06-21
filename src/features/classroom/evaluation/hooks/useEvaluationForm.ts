"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { submitDiagnosisResult } from "@/features/services/evaluation.service";
import { buildDiagnosisResultPayload } from "../actions";
import { DIAGNOSIS_RESULT_STORAGE_KEY, PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY } from "../types";
import type { DiagnosisOption, EvaluationAnswer, EvaluationFormQuestion } from "../types";

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

    const currentQuestion = questions[step] ?? null;

    // 현재 문항에 대해 사용자가 선택한 답안 조회
    const selectedAnswer = currentQuestion
        ? answers.find((ans) => ans.questionId === currentQuestion.questionId)?.selectedOption ?? null
        : null;

    const isLast = questions.length > 0 && step === questions.length - 1;

    // 모든 문항에 답변이 채워졌는지 여부 검증
    const isAllAnswered = questions.length > 0 && questions.every((q) =>
        answers.some((ans) => ans.questionId === q.questionId)
    );

    // 상단 진행률 프로그레스 바 연산
    const progress = questions.length > 0
        ? Math.round(((step + 1) / questions.length) * 100)
        : 0;

    // 답안 선택 및 업데이트 핸들러
    const handleSelectAnswer = (selectedOption: number) => {
        if (!currentQuestion || selectedOption < 1 || selectedOption > 4) return;

        const validOption = selectedOption as DiagnosisOption;

        setAnswers((prev) => {
        // 기존에 동일 문항에 대한 답변이 있었다면 제거 후 필터링
        const remaining = prev.filter((ans) => ans.questionId !== currentQuestion.questionId);
        return [
            ...remaining,
            { questionId: currentQuestion.questionId, selectedOption: validOption },
        ];
        });

        setSubmitErrorMessage("");
    };

    // 이전 스텝 이동
    const handlePrev = () => {
        setStep((current) => Math.max(current - 1, 0));
    };

    // 다음 스텝 이동 또는 모달 활성화
    const handleNext = () => {
        if (selectedAnswer === null) return;

        if (isLast) {
        setIsCompleteModalOpen(true);
        return;
        }

        setStep((current) => Math.min(current + 1, questions.length - 1));
    };

    // 최종 진단평가 결과 제출
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

        // 결과 보존 후 완료 페이지 랜드마크 이동
        sessionStorage.setItem(DIAGNOSIS_RESULT_STORAGE_KEY, JSON.stringify(result));
        setIsCompleteModalOpen(false);

        router.replace(`/classroom/${continentCode}/${countryId}/evaluation/result`);
        } catch (error) {
        console.error("[diagnosis] 진단평가 제출 실패:", error);

        // 401 인증 만료 시: 현재까지 풀던 데이터 임시 백업 후 로그인 페이지 리다이렉트
        if (error instanceof ApiRequestError && error.status === 401) {
            sessionStorage.setItem(
            PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY,
            JSON.stringify({ continentCode, countryId, payload })
            );

            const redirectUrl = `/classroom/${continentCode}/${countryId}/evaluation`;
            router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
            return;
        }

        setSubmitErrorMessage(
            error instanceof Error ? error.message : "진단평가 제출에 실패했습니다."
        );
        } finally {
        setIsSubmitting(false);
        }
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
        closeCompleteModal: () => setIsCompleteModalOpen(false),
    };
}