// 이전, 다음, 제출 버튼을 담당

interface EvaluationNavigationProps {
  currentStep: number;
  isLast: boolean;
  hasSelectedAnswer: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function EvaluationNavigation({
  currentStep,
  isLast,
  hasSelectedAnswer,
  onPrev,
  onNext,
}: EvaluationNavigationProps) {
  const isFirst = currentStep === 0;

  return (
    <nav
      className="mt-10 flex gap-5 pb-20"
      aria-label="진단평가 이동"
    >                                                                           
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={`h-[50px] flex-1 rounded-3xl border text-2xl font-bold transition ${
          isFirst
            ? "cursor-not-allowed border-[#E4EAF2] bg-[#E4EAF2] text-[#B4BEC8]"
            : "border-[#E4EAF2] bg-white text-[#0A1628] hover:bg-gray-50"
        }`}
      >
        이전
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasSelectedAnswer}
        className={`h-[50px] flex-1 rounded-3xl text-2xl font-bold transition ${
          hasSelectedAnswer
            ? "bg-[#439A97] text-white hover:bg-[#357A78]"
            : "cursor-not-allowed bg-[#E4EAF2] text-[#B4BEC8]"
        }`}
      >
        {isLast ? "제출하기" : "다음"}
      </button>
    </nav>
  );
}