import { getErrorMessage } from "@/features/services/error.service";

export type SignupPathPeriod = "all" | "today" | "thisWeek" | "thisMonth" | "thisYear";

export const signupPathPeriods: SignupPathPeriod[] = [
  "all",
  "today",
  "thisWeek",
  "thisMonth",
  "thisYear",
];

export const signupPathPeriodLabels: Record<SignupPathPeriod, string> = {
  all: "전체",
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

// inflow/summary, inflow/channels 모두 from/to가 필수라 "전체"도 넓은 기본 범위로 보냅니다.
export const getSignupPathDateRange = (
  period: SignupPathPeriod
): { from: string; to: string } => {
  const now = new Date();
  const from = new Date(now);

  if (period === "all") {
    return { from: "2000-01-01", to: toDateInputValue(now) };
  }

  if (period === "today") {
    return { from: toDateInputValue(now), to: toDateInputValue(now) };
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

  return { from: toDateInputValue(from), to: toDateInputValue(now) };
};

export const signupPathColors = [
  "#439A97",
  "#D4529C",
  "#E3A239",
  "#8057E8",
  "#667085",
  "#2F80ED",
  "#12B76A",
];

export const formatSignupPathError = (
  error: unknown,
  fallbackMessage: string
) => getErrorMessage(error, fallbackMessage);

export const formatNumber = (value: number) =>
  Number(value || 0).toLocaleString("ko-KR");

export const formatPercent = (value: number) =>
  `${Number(value || 0).toFixed(1)}%`;

export const formatWon = (value: number) => {
  const amount = Number(value || 0);

  if (Math.abs(amount) >= 100_000_000) {
    return `${trimDecimal(amount / 100_000_000)}억원`;
  }

  if (Math.abs(amount) >= 10_000) {
    return `${trimDecimal(amount / 10_000)}만원`;
  }

  return `${amount.toLocaleString("ko-KR")}원`;
};

const trimDecimal = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);
