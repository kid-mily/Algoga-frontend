import type { PackageApiItem, PaymentBreakdown } from "../types";

interface CalculatePaymentParams {
  lecturePrice: number;
  packageItem: PackageApiItem;
}

export function calculatePayment({
  lecturePrice,
  packageItem,
}: CalculatePaymentParams): PaymentBreakdown {
  const lectureAmount = lecturePrice;
  const flightAmount = packageItem.flightPrice;
  // 패키지 응답에 이미 계산된 값이 있어(accommodationPrice = pricePerNight × nights) 그대로 쓴다
  const accommodationAmount = packageItem.accommodationPrice;
  const travelAmount = flightAmount + accommodationAmount;
  const depositAmount = Math.trunc((travelAmount * 30) / 100);
  const balanceAmount = travelAmount - depositAmount;
  const initialPaymentAmount = lectureAmount + depositAmount;

  return {
    lectureAmount,
    flightAmount,
    accommodationAmount,
    travelAmount,
    depositAmount,
    balanceAmount,
    initialPaymentAmount,
  };
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatBalanceDueDate(startDate: string): string {
  const [year, month, day] = startDate.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) return "출발일 7일 전";

  const dueDate = new Date(Date.UTC(year, month - 1, day));
  dueDate.setUTCDate(dueDate.getUTCDate() - 7);

  return `${dueDate.getUTCFullYear()}년 ${dueDate.getUTCMonth() + 1}월 ${dueDate.getUTCDate()}일`;
}
