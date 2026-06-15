"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import CheckModal from "@/features/common/CheckModal";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import { submitDiagnosisResult } from "@/features/services/evaluation.service";

import EvaluationHeader from "./EvaluationHeader";
import EvaluationNavigation from "./EvaluationNavigation";
import EvaluationQuestion from "./EvaluationQuestion";

import type {
  EvaluationAnswer,
  EvaluationFormQuestion,
} from "./types";
import { DIAGNOSIS_RESULT_STORAGE_KEY } from "./types";

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

  // 현재 문제 번호
  const [step, setStep] = useState(0);

  // 사용자가 선택한 답안 목록
  const [answers, setAnswers] = useState<EvaluationAnswer[]>([]);

  // 완료 모달 열림 여부
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // 제출 중인지 확인
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 제출 오류 메시지
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  // 시간이 종료되었는지 확인
  const [isTimeEnded, setIsTimeEnded] = useState(false);

  // 현재 보여주는 문제
  const currentQuestion = questions[step];

  // 현재 문제에서 사용자가 선택한 답안
  const selectedAnswer =
    answers.find(
      (answer) => answer.questionId === currentQuestion?.questionId
    )?.selectedOption ?? null;

  // 현재 문제가 마지막 문제인지 확인
  const isLast = step === questions.length - 1;

  // 현재 진행률 계산
  const progress =
    questions.length > 0
      ? Math.round(((step + 1) / questions.length) * 100)
      : 0;

  // 답안 선택
  const handleSelectAnswer = (selectedOption: number) => {
    // 시간이 끝났거나 현재 문제가 없다면 선택하지 않음
    if (!currentQuestion || isTimeEnded) {
      return;
    }

    setAnswers((prev) => {
      // 현재 문제의 기존 답안 제거
      const remainingAnswers = prev.filter(
        (answer) => answer.questionId !== currentQuestion.questionId
      );

      // 새로 선택한 답안 추가
      return [
        ...remainingAnswers,
        {
          questionId: currentQuestion.questionId,
          selectedOption,
        },
      ];
    });
  };

  // 이전 문제로 이동
  const handlePrev = () => {
    // 시간이 끝난 뒤에는 이동하지 않음
    if (isTimeEnded) {
      return;
    }

    setStep((prev) => Math.max(prev - 1, 0));
  };

  // 다음 문제 또는 제출
  const handleNext = () => {
    // 시간이 끝났거나 답안을 선택하지 않았다면 실행하지 않음
    if (isTimeEnded || selectedAnswer === null) {
      return;
    }

    // 마지막 문제라면 완료 모달 열기
    if (isLast) {
      setIsCompleteModalOpen(true);
      return;
    }

    // 다음 문제로 이동
    setStep((prev) => prev + 1);
  };

  // 제한 시간이 끝난 경우
  const handleTimeEnd = useCallback(() => {
    // 시간 종료 상태로 변경
    setIsTimeEnded(true);

    // 결과 제출 모달 표시
    setIsCompleteModalOpen(true);
  }, []);

    // 진단평가 결과 제출
    const handleSubmitResult = async () => {
    // 시간이 끝난 경우에는 답안 제출 API를 호출하지 않고 초급 추천으로 이동
    if (isTimeEnded) {
        setIsCompleteModalOpen(false);

        router.replace(
        `/classroom/${continentCode}/${countryId}/evaluation/result?level=BEGINNER&reason=time-ended`
        );

        return;
    }

    if (answers.length === 0) {
        setSubmitErrorMessage("선택한 답안이 없어 결과를 제출할 수 없습니다.");
        return;
    }

    try {
        setIsSubmitting(true);
        setSubmitErrorMessage("");

        const result = await submitDiagnosisResult({
        countryId: Number(countryId),
        answers,
        });

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

        setSubmitErrorMessage(
        error instanceof Error
            ? error.message
            : "진단평가 결과 제출에 실패했습니다."
        );
    } finally {
        setIsSubmitting(false);
    }
    };

  // 진단평가 문제가 없는 경우
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
        {/* 제목, 진행률, 타이머 */}
        <EvaluationHeader
          continentCode={continentCode}
          countryId={countryId}
          questions={questions}
          currentStep={step}
          progress={progress}
          onTimeEnd={handleTimeEnd}
        />

        {/* 문제 영역 */}
        <form
          className="mt-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <EvaluationQuestion
            question={currentQuestion}
            questionNumber={step + 1}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
          />

          {/* 이전, 다음, 제출 버튼 */}
          <EvaluationNavigation
            currentStep={step}
            isLast={isLast}
            hasSelectedAnswer={selectedAnswer !== null}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </form>
      </section>

      {/* 정상 제출 또는 시간 종료 모달 */}
      <CheckModal
        open={isCompleteModalOpen}
        title={
          isTimeEnded
            ? "진단평가 시간이 종료되었습니다."
            : "진단 결과를 확인할까요?"
        }
        description={
          submitErrorMessage ||
          (isTimeEnded
            ? "현재까지 작성한 답안으로 결과를 제출합니다."
            : "응답을 바탕으로 맞춤 강의를 추천해드릴게요.")
        }
        buttonText={isSubmitting ? "제출 중..." : "결과 보기"}
        onConfirm={handleSubmitResult}
      />
    </main>
  );
}