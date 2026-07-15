import type {
  CountryLectureConversion,
  LectureConversionFunnelStep,
  LectureConversionPeriod,
  LectureConversionQuery,
} from "./types";

export const formatPeople = (value: number) => `${value.toLocaleString()}명`;

export const formatPercent = (value: number) => `${value.toLocaleString()}%`;

export const formatMultiplier = (value: number) => `${value.toLocaleString()}×`;

export const lectureConversionPeriods: LectureConversionPeriod[] = [
  "today",
  "thisWeek",
  "thisMonth",
  "thisYear",
];

export const lectureConversionPeriodLabels: Record<LectureConversionPeriod, string> = {
  today: "오늘",
  thisWeek: "이번주",
  thisMonth: "이번달",
  thisYear: "올해",
};

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const toDateInputValue = (date: Date) => dateInputFormatter.format(date);

export const getLectureConversionDateRange = (
  period: LectureConversionPeriod
): LectureConversionQuery => {
  const now = new Date();
  const from = new Date(now);

  if (period === "today") {
    return {
      from: toDateInputValue(now),
      to: toDateInputValue(now),
    };
  }

  if (period === "thisWeek") {
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    from.setDate(now.getDate() + mondayOffset);
  }

  if (period === "thisMonth") {
    from.setDate(1);
  }

  if (period === "thisYear") {
    from.setMonth(0, 1);
  }

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(now),
  };
};

// 백엔드가 나라별 평가 등급을 안 내려줘서 conversionRate 기준으로 FE에서 직접 분류합니다 (기존 목데이터 경계값 기준: 20%↑ 우수 / 10~20% 보통 / 10% 미만 저조)
export const getCountryEvaluation = (
  conversionRate: number
): CountryLectureConversion["evaluation"] => {
  if (conversionRate > 20) return "우수";
  if (conversionRate > 10) return "보통";
  return "저조";
};

export const funnelToneStyles: Record<
  LectureConversionFunnelStep["tone"],
  {
    panel: string;
    value: string;
    bar: string;
  }
> = {
  teal: {
    panel: "border-[#BFE6E1] bg-[#F2FBFA]",
    value: "text-[#2FAE9B]",
    bar: "bg-[#2FAE9B]",
  },
  purple: {
    panel: "border-[#DDD7FF] bg-[#F7F5FF]",
    value: "text-[#8B7CF6]",
    bar: "bg-[#8B7CF6]",
  },
  orange: {
    panel: "border-[#FAD9A6] bg-[#FFF9EF]",
    value: "text-[#F59E32]",
    bar: "bg-[#F59E32]",
  },
};

export const evaluationBadgeClassName: Record<
  CountryLectureConversion["evaluation"],
  string
> = {
  우수: "bg-[#E4F8EF] text-[#16A34A]",
  보통: "bg-[#FFF4D8] text-[#F59E0B]",
  저조: "bg-[#FEE2E2] text-[#EF4444]",
};
