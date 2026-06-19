import { getErrorMessage } from "@/features/services/error.service";
import { SignupPathStatistic, SignupPathSummary } from "./types";

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

export const getSignupPathSummary = (
  statistics: SignupPathStatistic[]
): SignupPathSummary => {
  const totalSignupCount = statistics.reduce(
    (sum, statistic) => sum + statistic.signupCount,
    0
  );
  const topPath = statistics.reduce<SignupPathStatistic | null>(
    (currentTop, statistic) =>
      !currentTop || statistic.signupCount > currentTop.signupCount
        ? statistic
        : currentTop,
    null
  );

  return {
    totalSignupCount,
    pathCount: statistics.length,
    topPathLabel: topPath?.label ?? "-",
    topPathRatio: topPath?.ratio ?? 0,
  };
};
