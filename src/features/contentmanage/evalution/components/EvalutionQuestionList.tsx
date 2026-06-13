import { EvalutionQuestion } from "../types";
import EvalutionQuestionCard from "./EvalutionQuestionCard";

type EvalutionQuestionListProps = {
  questions: EvalutionQuestion[];
  expandedId: number | null;
  onToggle: (questionId: number) => void;
  onEdit: (questionId: number) => void;
  onDelete: (question: EvalutionQuestion) => void;
};

export default function EvalutionQuestionList({
  questions,
  expandedId,
  onToggle,
  onEdit,
  onDelete,
}: EvalutionQuestionListProps) {
  return (
    <section aria-labelledby="evalution-question-list-title">
      <h2 id="evalution-question-list-title" className="sr-only">
        진단평가 문제 목록
      </h2>

      {questions.length === 0 ? (
        <p className="px-6 py-12 text-center text-[14px] text-[#667085]">
          등록된 문제가 없습니다.
        </p>
      ) : (
        questions.map((question, index) => (
          <EvalutionQuestionCard
            key={question.id}
            question={question}
            order={index + 1}
            isExpanded={expandedId === question.id}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </section>
  );
}
