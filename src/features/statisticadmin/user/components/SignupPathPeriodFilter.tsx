import {
  SignupPathPeriod,
  signupPathPeriodLabels,
  signupPathPeriods,
} from "../utils";

type SignupPathPeriodFilterProps = {
  selectedPeriod: SignupPathPeriod;
  onPeriodChange: (period: SignupPathPeriod) => void;
};

export default function SignupPathPeriodFilter({
  selectedPeriod,
  onPeriodChange,
}: SignupPathPeriodFilterProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        {signupPathPeriods.map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => onPeriodChange(period)}
            className={`h-[32px] cursor-pointer rounded-[10px] border px-4 text-[13px] font-semibold ${
              selectedPeriod === period
                ? "border-[#439A97] bg-[#439A97] text-white"
                : "border-[#E4E7EC] bg-white text-[#667085]"
            }`}
          >
            {signupPathPeriodLabels[period]}
          </button>
        ))}
      </div>

      <p className="text-[12px] text-[#98A2B3]">
        가입일 기준 기간 필터입니다. 유입경로 비율·상세통계에만 적용되며,
        대시보드 요약과 순매출 차트는 전체 기간 기준입니다.
      </p>
    </div>
  );
}
