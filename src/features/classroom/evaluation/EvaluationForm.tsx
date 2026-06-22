"use client";

import CheckModal from "@/features/common/CheckModal";
import SubHeader from "@/features/contentmanage/common/SubHeader";
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
    closeCompleteModal,
  } = useEvaluationForm({
    continentCode,
    countryId,
    questions,
  });

  if (questions.length === 0) {
    return (
      <main className="relative min-h-[calc(100dvh-64px)] overflow-hidden bg-[#F3F8FC] px-4 py-6">
        {/* 배경 장식 */}
        <div className="pointer-events-none absolute -left-20 top-16 h-48 w-48 rounded-full bg-[#DCEEF3]/70" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-[#E8F3E8]/70" />

        <section className="relative mx-auto w-full max-w-2xl">
          <SubHeader
            backHref={`/classroom/${continentCode}/${countryId}`}
            backText="강의 목록으로 돌아가기"
            title=""
            description=""
          />

          <article className="mt-5 rounded-2xl border border-[#E3EDF3] bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF5F5] text-xl">
              🧭
            </div>

            <h1 className="mt-4 text-xl font-bold text-[#0A1628]">
              준비된 진단평가가 없습니다
            </h1>

            <p className="mt-2 text-sm font-medium text-[#8A94A6]">
              해당 여행지의 진단평가 문제를 준비 중입니다.
            </p>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100dvh-64px)] overflow-hidden bg-[#F3F8FC] px-4 py-5">
      {/* 배경 */}
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-[#DDEFF3]/65" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#E6F2E8]/70" />

      <section className="relative mx-auto w-full max-w-2xl">
        <EvaluationHeader
          continentCode={continentCode}
          countryId={countryId}
          questions={questions}
          currentStep={step}
          progress={progress}
        />

        <form
          className="mt-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <EvaluationQuestion
            question={currentQuestion}
            questionNumber={step + 1}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />

          <EvaluationNavigation
            currentStep={step}
            isLast={isLast}
            hasSelectedAnswer={
              isLast ? isAllAnswered : selectedAnswer !== null
            }
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </form>

        {submitErrorMessage && (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-semibold text-red-500"
          >
            {submitErrorMessage}
          </p>
        )}
      </section>

      <CheckModal
        open={isCompleteModalOpen}
        title="진단평가를 제출하시겠습니까?"
        description="제출하면 답안을 수정할 수 없습니다."
        buttonText={isSubmitting ? "제출 중..." : "제출하기"}
        cancelText="계속 풀기"
        isProcessing={isSubmitting}
        onCancel={closeCompleteModal}
        onConfirm={handleSubmitResult}
      />
    </main>
  );
}