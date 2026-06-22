"use client";

import CheckModal from "@/features/common/components/CheckModal";
import SubHeader from "@/features/common/components/SubHeader";
import EvaluationHeader from "./EvaluationHeader";
import EvaluationNavigation from "./EvaluationNavigation";
import EvaluationQuestion from "./EvaluationQuestion";
import { useEvaluationForm } from "./hooks/useEvaluationForm";
import type { EvaluationFormQuestion } from "./types";

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
  const {
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
  } = useEvaluationForm({
    continentCode,
    countryId,
    questions,
  });

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