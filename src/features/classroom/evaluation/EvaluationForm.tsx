"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CheckModal from "@/features/common/CheckModal";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import {
  DiagnosisSubmitError,
  submitDiagnosisResult,
} from "@/features/services/evaluation.service";

import EvaluationHeader from "./EvaluationHeader";
import EvaluationNavigation from "./EvaluationNavigation";
import EvaluationQuestion from "./EvaluationQuestion";

import type { EvaluationAnswer, EvaluationFormQuestion } from "./types";
import {
  DIAGNOSIS_RESULT_STORAGE_KEY,
  PENDING_DIAGNOSIS_SUBMIT_STORAGE_KEY,
} from "./types";

interface EvaluationFormProps {
  continentCode: string;
  countryId: string;
  questions: EvaluationFormQuestion[];
}

export default function EvaluationForm({
  continentCode,
  countryId,
  questions,
}: EvaluationFormProps) {
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
    const sortedAnswers = questions
      .map((question) =>
        answers.find((answer) => answer.questionId === question.questionId)
      )
      .filter((answer): answer is EvaluationAnswer => Boolean(answer));

    if (sortedAnswers.length !== questions.length) {
      setIsCompleteModalOpen(false);
      setSubmitErrorMessage("모든 문항에 답변한 뒤 제출해 주세요.");
      return;
    }

    const payload = {
      countryId: Number(countryId),
      answers: sortedAnswers.map((answer) => ({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
      })),
    };

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

  if (questions.length === 0) {
    return (
      <main className="min-h-screen w-full bg-[#F5F7FA] px-4 py-10">
        <section className="mx-auto w-full max-w-5xl pt-20">
          <SubHeader
            backHref={`/classroom/${continentCode}/${countryId}`}
            backText="강의 목록으로 돌아가기"
            title=""
            description=""
          />

          <article className="mt-8 rounded-3xl bg-white px-8 py-16 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#0A1628]">
              준비된 진단평가가 없습니다.
            </h1>

            <p className="mt-3 text-sm font-medium text-[#8A94A6]">
              해당 국가의 진단평가 문제를 준비 중입니다.
            </p>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#F5F7FA] px-4 py-10">
      <section className="mx-auto w-full max-w-5xl pt-20">
        <EvaluationHeader
          continentCode={continentCode}
          countryId={countryId}
          questions={questions}
          currentStep={step}
          progress={progress}
        />

        <form className="mt-3" onSubmit={(event) => event.preventDefault()}>
          <EvaluationQuestion
            question={currentQuestion}
            questionNumber={step + 1}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />

          <EvaluationNavigation
            currentStep={step}
            isLast={isLast}
            hasSelectedAnswer={isLast ? isAllAnswered : selectedAnswer !== null}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </form>

        {submitErrorMessage && (
          <p className="mt-4 text-center text-sm font-semibold text-red-500">
            {submitErrorMessage}
          </p>
        )}
      </section>

      <CheckModal
        open={isCompleteModalOpen}
        title="진단평가를 제출할까요?"
        description="제출 후에는 답안을 수정할 수 없습니다."
        buttonText={isSubmitting ? "제출 중..." : "제출하기"}
        onConfirm={handleSubmitResult}
      />
    </main>
  );
}