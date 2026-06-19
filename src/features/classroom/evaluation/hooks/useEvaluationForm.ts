"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DiagnosisSubmitError, submitDiagnosisResult } from "@/features/services/evaluation.service";
import { buildDiagnosisResultPayload } from "../actions";
import { DIAGNOSIS_RESULT_STORAGE_KEY, PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY} from "../types";
import type { EvaluationAnswer, EvaluationFormQuestion } from "../types";

interface Params {
    continentCode: string;
    countryId: string;
    questions: EvaluationFormQuestion[];
}

export function useEvaluationForm({ continentCode, countryId, questions }: Params) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<EvaluationAnswer[]>([]);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");

    const currentQuestion = questions[step];

    const selectedAnswer =
        answers.find((answer) => answer.questionId === currentQuestion?.questionId)
        ?.selectedOption ?? null;

    const isLast = step === questions.length - 1;
    const isAllAnswered = answers.length === questions.length;

    const progress =
        questions.length > 0
        ? Math.round(((step + 1) / questions.length) * 100)
        : 0;

    const handleSelectAnswer = (selectedOption: number) => {
        if (!currentQuestion) return;

        setAnswers((prev) => {
        const remainingAnswers = prev.filter(
            (answer) => answer.questionId !== currentQuestion.questionId
        );

        return [
            ...remainingAnswers,
            {
            questionId: currentQuestion.questionId,
            selectedOption,
            },
        ];
        });
    };

    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        if (selectedAnswer === null) return;

        if (isLast) {
        setIsCompleteModalOpen(true);
        return;
        }

        setStep((prev) => prev + 1);
    };

    const handleSubmitResult = async () => {
        const payload = buildDiagnosisResultPayload({
        countryId,
        questions,
        answers,
        });

        if (!payload) {
        setIsCompleteModalOpen(false);
        setSubmitErrorMessage("모든 문항에 답한 뒤 제출해 주세요.");
        return;
        }

        try {
        setIsSubmitting(true);
        setSubmitErrorMessage("");

        const result = await submitDiagnosisResult(payload);

        sessionStorage.setItem(
            DIAGNOSIS_RESULT_STORAGE_KEY,
            JSON.stringify(result)
        );

        setIsCompleteModalOpen(false);

        router.replace(
            `/classroom/${continentCode}/${countryId}/evaluation/result?level=${result.level}`
        );
        } catch (error) {
        console.error("진단평가 결과 제출 실패:", error);

        if (
            error instanceof DiagnosisSubmitError &&
            error.status === 401 &&
            error.errorCode === "LMS_039"
        ) {
            sessionStorage.setItem(
            PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY,
            JSON.stringify({
                continentCode,
                countryId,
                payload,
            })
            );

            router.push("/auth/login");
            return;
        }

        if (error instanceof DiagnosisSubmitError) {
            setSubmitErrorMessage(
            error.traceId
                ? `${error.message} traceId: ${error.traceId}`
                : error.message
            );
            return;
        }

        setSubmitErrorMessage(
            error instanceof Error
            ? error.message
            : "진단평가 결과 제출에 실패했습니다."
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
    }; 
}