import type { EvaluationFormQuestion } from "./types";

interface EvaluationQuestionProps {
  question: EvaluationFormQuestion;
  questionNumber: number;
  selectedAnswer: number | null;
  onSelectAnswer: (optionNumber: number) => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function EvaluationQuestion({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}: EvaluationQuestionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#E1EBF1] bg-white px-6 py-5 shadow-sm">
      {/* 티켓 모양 장식 */}
      <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F3F8FC]" />
      <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#F3F8FC]" />

      {/* 문제 영역 */}
      <header className="border-b border-dashed border-[#DCE7ED] pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#98A2B3]">
            문제 {questionNumber}
          </span>
        </div>

        <div className="mt-3 flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#439A97] text-sm font-bold text-white">
            Q
          </span>

          <h2 className="pt-1 text-base font-bold leading-7 text-[#0A1628]">
            {question.questionText}
          </h2>
        </div>
      </header>

      {/* 선택지 */}
      <div
        className="mt-4 space-y-2.5"
        role="radiogroup"
        aria-label={`문제 ${questionNumber} 보기`}
      >
        {question.options.map((option, index) => {
          const optionNumber = index + 1;
          const isSelected =
            selectedAnswer === optionNumber;

          return (
            <button
              key={`${question.questionId}-${optionNumber}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() =>
                onSelectAnswer(optionNumber)
              }
              className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition cursor-pointer ${
                isSelected
                  ? "border-[#439A97] bg-[#EDF8F7] text-[#245F5D] shadow-sm"
                  : "border-[#E3EAF0] bg-white text-[#0A1628] hover:border-[#89B9B6] hover:bg-[#F7FBFB]"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isSelected
                    ? "bg-[#439A97] text-white"
                    : "bg-[#EFF4F7] text-[#7D8A99]"
                }`}
              >
                {OPTION_LABELS[index] ??
                  optionNumber}
              </span>

              <span className="text-sm font-semibold leading-6">
                {option}
              </span>

              {isSelected && (
                <span className="ml-auto text-sm font-bold text-[#439A97]"/>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}