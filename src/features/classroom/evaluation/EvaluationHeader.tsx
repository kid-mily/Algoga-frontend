import Link from "next/link";

import Timer from "@/features/classroom/evaluation/Timer";

import type { EvaluationFormQuestion } from "./types";

interface EvaluationHeaderProps {
  continentCode: string;
  countryId: string;
  questions: EvaluationFormQuestion[];
  currentStep: number;
  progress: number;

  // 시간이 종료됐을 때 실행할 함수
  onTimeEnd: () => void;
}

export default function EvaluationHeader({
  continentCode,
  countryId,
  questions,
  currentStep,
  progress,
  onTimeEnd,
}: EvaluationHeaderProps) {
  return (
    <header>
      {/* 강의실로 돌아가기 */}
      <Link
        href={`/classroom/${continentCode}/${countryId}`}
        className="text-sm font-semibold text-[#667085] transition hover:text-[#111827]"
      >
        {"<"} 돌아가기
      </Link>

      <article className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          {/* 진단평가 제목 */}
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628]">
              여행 진단평가
            </h1>

            <p className="mt-3 text-lg font-medium text-[#8A94A6]">
              나에게 맞는 강의를 추천받아보세요.
            </p>
          </div>

          {/* 남은 시간 */}
          <div className="flex items-center gap-3 rounded-3xl bg-[#FFF3E0] px-6 py-4">
            <span className="text-sm font-bold text-[#E65100]">
              남은 시간
            </span>

            <Timer onTimeEnd={onTimeEnd} />
          </div>
        </div>

        {/* 진행률 영역 */}
        <section
          className="mt-10"
          aria-labelledby="evaluation-progress"
        >
          <div className="flex items-center justify-between">
            <h2
              id="evaluation-progress"
              className="text-2xl font-bold text-[#0A1628]"
            >
              문제 {currentStep + 1} / {questions.length}
            </h2>

            <span className="font-semibold text-[#8A94A6]">
              {progress}% 완료
            </span>
          </div>

          {/* 진행률 막대 */}
          <div
            className="mt-5 h-3 w-full rounded-full bg-[#E8EEF5]"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-[#439A97] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 문제 번호 목록 */}
          <ol
            className="mt-8 flex flex-wrap gap-3"
            aria-label="문제 진행 상태"
          >
            {questions.map((question, index) => {
              const isCurrentQuestion = currentStep === index;

              return (
                <li key={question.questionId}>
                  <span
                    className={`flex h-8 w-12 items-center justify-center rounded-xl border text-sm font-bold ${
                      isCurrentQuestion
                        ? "border-[#439A97] text-[#439A97]"
                        : "border-[#E8EEF5] text-[#B0BEC5]"
                    }`}
                  >
                    {index + 1}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </article>
    </header>
  );
}