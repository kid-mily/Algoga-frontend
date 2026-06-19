import { getErrorMessage } from "@/features/services/error.service";

export const formatCouponStatisticsError = (
  error: unknown,
  fallbackMessage: string
) => getErrorMessage(error, fallbackMessage);

export const formatWon = (value: number) =>
  `${Number(value || 0).toLocaleString("ko-KR")}원`;

export const formatPercent = (value: number) =>
  `${Number(value || 0).toFixed(1)}%`;

export const formatDate = (value: string) => {
  if (!value || value === "-") return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export const formatDiscount = (type: string, value: number) => {
  if (type === "RATE") return `${value}%`;
  if (type === "AMOUNT") return formatWon(value);

  return `${value.toLocaleString("ko-KR")}`;
};
