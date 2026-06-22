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
      className="mt-4"
      aria-label="진단평가 이동"
    >

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`h-11 flex-1 rounded-xl border text-sm font-bold transition ${
            isFirst
              ? "cursor-not-allowed border-[#E3E9EE] bg-[#E9EEF2] text-[#ADB7C0]"
              : "border-[#D7E1E8] bg-white text-[#243247] hover:bg-[#F7FAFC] cursor-pointer"
          }`}
        >
          이전 문제
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasSelectedAnswer}
          className={`h-11 flex-[1.5] rounded-xl text-sm font-bold transition ${
            hasSelectedAnswer
              ? "bg-[#439A97] text-white shadow-sm hover:bg-[#357A78] cursor-pointer"
              : "cursor-not-allowed bg-[#D6E0E3] text-[#9EAAAF]"
          }`}
        >
          {isLast
            ? "진단평가 제출하기"
            : "다음 문제"}
        </button>
      </div>
    </nav>
  );
}