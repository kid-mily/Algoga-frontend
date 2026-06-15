// 현재 문제와 선택지를 보여주는 컴포넌트

import type { EvaluationFormQuestion } from "./types";

interface EvaluationQuestionProps {
  // 현재 문제
  question: EvaluationFormQuestion;

  // 현재 문제 번호
  questionNumber: number;

  // 현재 선택한 답안 번호
  selectedAnswer: number | null;

  // 답안을 선택했을 때 실행하는 함수
  onSelectAnswer: (optionNumber: number) => void;
}

export default function EvaluationQuestion({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}: EvaluationQuestionProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* 문제 번호와 제목 */}
      <div className="ml-3 flex items-center gap-3">
        <span className="text-2xl font-bold text-[#439A97]">
          Q{questionNumber}.
        </span>

        <h2 className="text-2xl font-bold leading-relaxed text-[#0A1628]">
          {question.questionText}
        </h2>
      </div>

      {/* 선택지 목록 */}
      <div className="mt-8 flex flex-col gap-4">
        {question.options.map((option, index) => {
          // 백엔드는 선택지를 1, 2, 3, 4 숫자로 받음
          const optionNumber = index + 1;
          const isSelected = selectedAnswer === optionNumber;

          return (
            <button
              key={`${question.questionId}-${optionNumber}`}
              type="button"
              onClick={() => onSelectAnswer(optionNumber)}
              aria-pressed={isSelected}
              className={`flex min-h-[68px] w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                isSelected
                  ? "border-[#439A97] bg-[#439A97] text-white shadow-[0_10px_24px_rgba(67,154,151,0.28)]"
                  : "border-[#E4EAF2] bg-white text-[#0A1628] hover:border-[#439A97] hover:bg-[#F7FBFB]"
              }`}
            >
              <span className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isSelected
                      ? "bg-white text-[#439A97]"
                      : "bg-[#F5F7FA] text-[#8A94A6]"
                  }`}
                >
                  {optionNumber}
                </span>

                <span className="text-lg font-semibold leading-relaxed">
                  {option}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}