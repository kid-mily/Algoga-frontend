import { ApiRequestError } from "@/lib/api";

export const formatWon = (value: number) =>
  `${Number(value || 0).toLocaleString("ko-KR")}원`;

export const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
};

export const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDefaultPaymentDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    from: formatDateInputValue(firstDayOfMonth),
    to: formatDateInputValue(today),
  };
};

export const formatPaymentError = (
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof ApiRequestError) {
    return [
      fallbackMessage,
      error.status ? `상태: ${error.status}` : "",
      error.code ? `코드: ${error.code}` : "",
      error.url ? `요청: ${error.url}` : "",
      error.message ? `메시지: ${error.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return error instanceof Error ? error.message : fallbackMessage;
};
