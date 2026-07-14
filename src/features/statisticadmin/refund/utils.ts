import type { CountryRefundRateStatus, RefundPeriod, TrendUnit } from "./types";

export const refundPeriods: RefundPeriod[] = [
  "today",
  "thisWeek",
  "thisMonth",
  "thisYear",
];

export const refundPeriodLabels: Record<RefundPeriod, string> = {
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

export const getRefundDateRange = (period: RefundPeriod) => {
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

// FE는 선택된 기간 프리셋에 맞춰 unit을 보냅니다: 오늘→HOUR / 이번주·이번달→DAY / 올해→MONTH
export const getTrendUnit = (period: RefundPeriod): TrendUnit => {
  if (period === "today") return "HOUR";
  if (period === "thisYear") return "MONTH";
  return "DAY";
};

export const trendUnitLabels: Record<TrendUnit, string> = {
  HOUR: "시간대별",
  DAY: "일별",
  MONTH: "월별",
};

export const formatWon = (value: number) =>
  `${value.toLocaleString("ko-KR")}원`;

export const formatPercent = (value: number) => `${value}%`;

export const formatMillionAmount = (value: number) =>
  `${Math.round(value / 1000000).toLocaleString("ko-KR")}M`;

export const getStatusLabel = (status: CountryRefundRateStatus) => {
  if (status === "RISK") return "위험";
  if (status === "WARNING") return "주의";
  return "정상";
};

export const getStatusClassName = (status: CountryRefundRateStatus) => {
  if (status === "RISK") return "bg-[#FEEEEE] text-[#EF4444]";
  if (status === "WARNING") return "bg-[#FFF4D8] text-[#F59E0B]";
  return "bg-[#E8F7F3] text-[#2FAE9B]";
};
