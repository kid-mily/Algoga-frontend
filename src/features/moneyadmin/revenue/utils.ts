import { getErrorMessage } from "@/features/services/error.service";

export const formatRevenueError = (error: unknown, fallbackMessage: string) =>
  getErrorMessage(error, fallbackMessage);

export const formatWon = (value: number) => `${value.toLocaleString()}원`;

export const formatMonthLabel = (year: number, month: number) =>
  `${year}.${String(month).padStart(2, "0")}`;

export const formatGrowthRate = (value: number) => {
  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toFixed(1)}%`;
};

export const getMonthDateRange = (year: number, month: number) => {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  return { from, to };
};
