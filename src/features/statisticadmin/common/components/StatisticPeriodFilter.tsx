export type StatisticPeriodOption<T extends string> = {
  label: string;
  value: T;
};

type StatisticPeriodFilterProps<T extends string> = {
  options: StatisticPeriodOption<T>[];
  selectedPeriod: T;
  onPeriodChange: (period: T) => void;
};

export default function StatisticPeriodFilter<T extends string>({
  options,
  selectedPeriod,
  onPeriodChange,
}: StatisticPeriodFilterProps<T>) {
  return (
    <div className="flex items-center gap-2">
      {options.map((option) => {
        const isActive = selectedPeriod === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onPeriodChange(option.value)}
            className={`h-10 cursor-pointer rounded-[12px] border px-4 text-[14px] font-semibold transition ${
              isActive
                ? "border-[#2FAE9B] bg-[#2FAE9B] text-white"
                : "border-[#E4E7EC] bg-white text-[#667085]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
