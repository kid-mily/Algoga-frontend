import { SalesOverviewPeriod } from "../types";
import {
  periodLabels,
  salesOverviewPeriods,
} from "../utils/salesOverviewFormatters";

import { SalesOverviewPeriodFilterProps } from '../types'

export default function SalesOverviewPeriodFilter({
  selectedPeriod,
  onPeriodChange,
}: SalesOverviewPeriodFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {salesOverviewPeriods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onPeriodChange(period)}
          className={`h-[32px] cursor-pointer rounded-[10px] border px-4 text-[13px] font-semibold ${
            selectedPeriod === period
              ? "border-[#2BB3A3] bg-[#2BB3A3] text-white"
              : "border-[#E4E7EC] bg-white text-[#667085]"
          }`}
        >
          {periodLabels[period]}
        </button>
      ))}
    </div>
  );
}
