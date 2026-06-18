import Image from "next/image";
import { EvalutionQuestionSet } from "../types";

type EvalutionQuestionCardProps = {
  questionSet: EvalutionQuestionSet;
  order: number;
  isExpanded: boolean;
  onToggle: (questionSetId: number) => void;
  onEdit: (questionId: number) => void;
  onDelete: (questionSet: EvalutionQuestionSet) => void;
};

export default function EvalutionQuestionCard({
  questionSet,
  order,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: EvalutionQuestionCardProps) {
  const editTargetId = questionSet.questions[0]?.id ?? questionSet.id;

  return (
    <article className="border-b border-[#EEF0F3] px-6 py-5 last:border-b-0">
      <div className="flex items-center">
        <span className="w-[42px] text-[14px] font-semibold text-[#C0C7D2]">
          {String(order).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-[12px] font-semibold text-[#667085]">
              {questionSet.country}
            </span>
          </div>

          <h3 className="truncate text-[15px] font-semibold text-[#111827]">
            {questionSet.country} 진단평가 {questionSet.questions.length}문항 세트
          </h3>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onToggle(questionSet.id)}
            aria-label={`${questionSet.country} 진단평가 세트 상세 보기`}
            aria-expanded={isExpanded}
          >
            <Image
              src="/images/arrow.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className={`transition ${
                isExpanded ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => onEdit(editTargetId)}
            aria-label={`${questionSet.country} 진단평가 세트 수정`}
          >
            <Image
              src="/images/edit.svg"
              alt=""
              aria-hidden="true"
              width={17}
              height={17}
            />
          </button>
          <button
            type="button"
            onClick={() => onDelete(questionSet)}
            aria-label={`${questionSet.country} 진단평가 세트 삭제`}
          >
            <Image
              src="/images/delete.svg"
              alt=""
              aria-hidden="true"
              width={17}
              height={17}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <ol className="mt-4 space-y-3 pl-[42px]" aria-label="진단평가 세트 문항">
          {questionSet.questions.map((question) => (
            <li
              key={question.id}
              className="rounded-[10px] border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#344054]"
            >
              <p className="font-semibold text-[#111827]">
                {question.questionOrder}. {question.title}
              </p>
              <p className="mt-2 text-[13px] text-[#667085]">
                정답: {question.options[question.answerIndex] ?? "-"}
              </p>
              {question.explanation && (
                <p className="mt-1 text-[13px] text-[#667085]">
                  해설: {question.explanation}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
