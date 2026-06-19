import { getErrorMessage } from "@/features/services/error.service";

export const formatConversionError = (
  error: unknown,
  fallbackMessage: string
) => getErrorMessage(error, fallbackMessage);

export const formatNumber = (value: number) =>
  Number(value || 0).toLocaleString("ko-KR");

export const formatPercent = (value: number) =>
  `${Number(value || 0).toFixed(1)}%`;

export const formatDateLabel = (value: string) => {
  if (!value) return "-";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return value;

  return `${month}.${day}`;
};

export const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDefaultConversionDateRange = () => {
  const to = new Date();
  const from = new Date();

  from.setDate(to.getDate() - 29);

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  };
};
