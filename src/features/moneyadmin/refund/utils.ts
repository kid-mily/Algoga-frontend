import { getErrorMessage } from "@/features/services/error.service";

export const formatRefundError = (error: unknown, fallbackMessage: string) =>
  getErrorMessage(error, fallbackMessage);

export const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;
