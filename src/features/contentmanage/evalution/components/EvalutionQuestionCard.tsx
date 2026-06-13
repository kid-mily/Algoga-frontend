import { EvalutionLevel, EvalutionQuestion } from "../types";

type EvalutionQuestionCardProps = {
  question: EvalutionQuestion;
  order: number;
  isExpanded: boolean;
  onToggle: (questionId: number) => void;
  onEdit: (questionId: number) => void;
  onDelete: (question: EvalutionQuestion) => void;
};

const levelStyle: Record<EvalutionLevel, string> = {
  초급: "bg-[#E7F4EC] text-[#16A34A]",
  중급: "bg-[#EEF4FF] text-[#4F46E5]",
  고급: "bg-[#F3E8FF] text-[#7E22CE]",
};

export default function EvalutionQuestionCard({
  question,
  order,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: EvalutionQuestionCardProps) {
  return (
    <article className="border-b border-[#EEF0F3] px-6 py-5 last:border-b-0">
      <div className="flex items-center">
        <span className="w-[42px] text-[14px] font-semibold text-[#C0C7D2]">
          {String(order).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${levelStyle[question.level]}`}
            >
              {question.level}
            </span>

            <span className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-[12px] font-semibold text-[#667085]">
              {question.country}
            </span>
          </div>

          <h3 className="truncate text-[15px] font-semibold text-[#111827]">
            {question.title}
          </h3>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onToggle(question.id)}
            aria-label={`${question.title} 상세 보기`}
            aria-expanded={isExpanded}
          >
            <img
              src="/images/arrow.svg"
              alt=""
              aria-hidden="true"
              className={`h-[18px] w-[18px] transition ${
                isExpanded ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => onEdit(question.id)}
            aria-label={`${question.title} 수정`}
          >
            <img
              src="/images/edit.svg"
              alt=""
              aria-hidden="true"
              className="h-[17px] w-[17px]"
            />
          </button>
          <button
            type="button"
            onClick={() => onDelete(question)}
            aria-label={`${question.title} 삭제`}
          >
            <img
              src="/images/delete.svg"
              alt=""
              aria-hidden="true"
              className="h-[17px] w-[17px]"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <ol className="mt-4 space-y-2 pl-[42px]" aria-label="선택지">
          {question.options.map((option, optionIndex) => (
            <li
              key={`${question.id}-${optionIndex}`}
              className={`rounded-[10px] border px-4 py-3 text-[14px] ${
                question.answerIndex === optionIndex
                  ? "border-[#439A97] bg-[#E7F4EC] text-[#111827]"
                  : "border-[#E4E7EC] bg-[#F9FAFB] text-[#344054]"
              }`}
            >
              {optionIndex + 1}. {option}
              {question.answerIndex === optionIndex && (
                <span className="ml-2 text-[12px] font-semibold text-[#439A97]">
                  정답
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
