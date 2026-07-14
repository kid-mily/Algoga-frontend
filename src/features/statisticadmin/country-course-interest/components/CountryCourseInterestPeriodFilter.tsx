import type { InterestPeriod } from "../types";

type CountryCourseInterestPeriodFilterProps = {
  selectedPeriod: InterestPeriod;
  onChange: (period: InterestPeriod) => void;
};

const PERIOD_OPTIONS: Array<{ label: string; value: InterestPeriod }> = [
  { label: "오늘", value: "today" },
  { label: "이번주", value: "week" },
  { label: "이번달", value: "month" },
  { label: "올해", value: "year" },
];

export default function CountryCourseInterestPeriodFilter({
  selectedPeriod,
  onChange,
}: CountryCourseInterestPeriodFilterProps) {
  return (
    <nav className="flex items-center gap-2" aria-label="관심도 기간 선택">
      {PERIOD_OPTIONS.map((option) => {
        const isActive = selectedPeriod === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`h-10 rounded-[12px] border px-4 text-[14px] font-semibold ${
              isActive
                ? "border-[#2FAE9B] bg-[#2FAE9B] text-white"
                : "border-[#E4E7EC] bg-white text-[#667085]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </nav>
  );
}
