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

// 백엔드가 from/to를 Instant/OffsetDateTime으로 받아서(순수 날짜, LocalDateTime
// 형식 둘 다 400) 한국 표준시(+09:00) 오프셋까지 붙인 값으로 보냅니다.
const toStartOfDayDateTime = (date: Date) =>
  `${toDateInputValue(date)}T00:00:00+09:00`;
const toEndOfDayDateTime = (date: Date) =>
  `${toDateInputValue(date)}T23:59:59+09:00`;

export const getSignupPathDateRange = (
  period: SignupPathPeriod
): { from?: string; to?: string } => {
  if (period === "all") return {};

  const now = new Date();
  const from = new Date(now);

  if (period === "today") {
    return { from: toStartOfDayDateTime(now), to: toEndOfDayDateTime(now) };
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

  return { from: toStartOfDayDateTime(from), to: toEndOfDayDateTime(now) };
};

export const signupPathLabels: Record<string, string> = {
  search: "검색 엔진",
  social: "소셜 미디어",
  friend: "지인 추천",
  ad: "광고",
  etc: "기타",
  "": "미입력",
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

export const normalizeSignupPathLabel = (value: string) => {
  const key = value.trim();
  const normalizedKey = key.toLowerCase();

  return signupPathLabels[normalizedKey] ?? (key || "미입력");
};

const signupPathAliases: Record<string, string> = {
  search: "search",
  "검색 엔진": "search",
  검색엔진: "search",
  검색: "search",
  social: "social",
  "소셜 미디어": "social",
  소셜미디어: "social",
  소셜: "social",
  sns: "social",
  friend: "friend",
  "지인 추천": "friend",
  지인추천: "friend",
  추천: "friend",
  referral: "friend",
  ad: "ad",
  ads: "ad",
  광고: "ad",
  etc: "etc",
  기타: "etc",
};

export const normalizeSignupPathKey = (value: string) => {
  const key = value.trim().toLowerCase();

  if (!key) return "";

  return signupPathAliases[key] ?? "etc";
};

const trimDecimal = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);
