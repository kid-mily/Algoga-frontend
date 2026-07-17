import type {
  AccommodationResponse,
  PackageApiItem,
  PaymentBreakdown,
} from "../types";

interface CalculatePaymentParams {
  lecturePrice: number;
  packageItem: PackageApiItem;
  accommodation: AccommodationResponse;
}

export function calculatePayment({
  lecturePrice,
  packageItem,
  accommodation,
}: CalculatePaymentParams): PaymentBreakdown {
  const lectureAmount = lecturePrice;
  const flightAmount = packageItem.flightPrice;
  const accommodationAmount = accommodation.pricePerNight * packageItem.nights;
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
