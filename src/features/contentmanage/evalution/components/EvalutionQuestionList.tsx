import { EvalutionQuestionSet } from "../types";
import EvalutionQuestionCard from "./EvalutionQuestionCard";

type EvalutionQuestionListProps = {
  questionSets: EvalutionQuestionSet[];
  isLoading: boolean;
  expandedId: number | null;
  onToggle: (questionSetId: number) => void;
  onEdit: (questionId: number) => void;
  onDelete: (questionSet: EvalutionQuestionSet) => void;
};

export default function EvalutionQuestionList({
  questionSets,
  isLoading,
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

      {isLoading ? (
        <p
          role="status"
          aria-live="polite"
          className="px-6 py-12 text-center text-[14px] text-[#667085]"
        >
          진단평가 문제를 불러오는 중입니다...
        </p>
      ) : questionSets.length === 0 ? (
        <p className="px-6 py-12 text-center text-[14px] text-[#667085]">
          등록된 진단평가 세트가 없습니다.
        </p>
      ) : (
        questionSets.map((questionSet, index) => (
          <EvalutionQuestionCard
            key={questionSet.countryId}
            questionSet={questionSet}
            order={index + 1}
            isExpanded={expandedId === questionSet.id}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </section>
  );
}
