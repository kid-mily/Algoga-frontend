import { SalesOverviewPeriod, SalesOverviewQuery, SalesTrendUnit } from "../types";

// 차트 추이 API의 unit: 오늘→시간, 이번주·이번달→일, 올해→월
export const getSalesTrendUnit = (period: SalesOverviewPeriod): SalesTrendUnit => {
  if (period === "today") return "HOUR";
  if (period === "thisYear") return "MONTH";
  return "DAY";
};

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const periodLabels: Record<SalesOverviewPeriod, string> = {
  today: "오늘",
  thisWeek: "이번주",
  thisMonth: "이번달",
  thisYear: "올해",
};

export const salesOverviewPeriods: SalesOverviewPeriod[] = [
  "today",
  "thisWeek",
  "thisMonth",
  "thisYear",
];

export const toDateInputValue = (date: Date) => dateInputFormatter.format(date);

export const getSalesOverviewDateRange = (
  period: SalesOverviewPeriod
): SalesOverviewQuery => {
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

export const getSalesTrendDateRange = (
  period: SalesOverviewPeriod
): SalesOverviewQuery => {
  const query = getSalesOverviewDateRange(period);

  if (period !== "thisWeek") return query;

  const weekEnd = new Date(`${query.from}T00:00:00+09:00`);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return {
    from: query.from,
    to: toDateInputValue(weekEnd),
  };
};

export const formatKoreanMoney = (amount: number) => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const absoluteAmount = Math.abs(safeAmount);

  if (absoluteAmount >= 100_000_000) {
    return `${trimDecimal(safeAmount / 100_000_000)}억원`;
  }

  if (absoluteAmount >= 10_000) {
    return `${trimDecimal(safeAmount / 10_000)}만원`;
  }

  return `${safeAmount.toLocaleString()}원`;
};

export const formatMillionAmount = (amount: number) =>
  `${trimDecimal((Number.isFinite(amount) ? amount : 0) / 1_000_000)}M`;

export const formatPercentValue = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${safeValue >= 0 ? "+" : ""}${trimDecimal(safeValue)}%`;
};

export const formatRateValue = (value: number) =>
  `${trimDecimal(Number.isFinite(value) ? value : 0)}%`;

export const toMillionValue = (amount: number) => Math.round(amount / 1_000_000);

export const isFutureDailyLabel = (label: string, now = new Date()) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) return false;

  return label > toDateInputValue(now);
};

const trimDecimal = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);
