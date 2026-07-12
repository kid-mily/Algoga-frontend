import { PACKAGE_DETAIL_DATA } from "./packageDetail.data";
import type { PaymentMethod, PaymentSuccessData } from "./paymentSuccess.types";

// 결제 완료 페이지 디자인 확인용 더미 예약 정보
// (실제로는 결제 승인/예약 생성 API 응답값을 사용해야 합니다)
const DUMMY_RESERVATION_NUMBER = "ALG-24061501";
const DUMMY_RESERVATION_DATE = "2024.06.01";
const DUMMY_BALANCE_DUE_DATE = "2024.06.08"; // 출발일(2024.06.15) 7일 전

// 선택한 결제 방식에 맞춰 결제 완료 페이지에 보여줄 데이터를 만든다
export function buildPaymentSuccessData(
  paymentMode: PaymentMethod
): PaymentSuccessData {
  const data = PACKAGE_DETAIL_DATA;
  const outboundFlight = data.flights[0];
  const isDeposit = paymentMode === "분할 결제";

  return {
    reservationNumber: DUMMY_RESERVATION_NUMBER,
    reservationDate: DUMMY_RESERVATION_DATE,
    paymentMode,
    packageName: data.title,
    destination: data.destination,
    startDate: data.startDate,
    endDate: data.endDate,
    duration: data.duration,
    airline: data.airline,
    flightNumber: outboundFlight?.flightNumber ?? "",
    accommodationName: data.accommodation.name,
    heroImage: data.heroImage,
    totalAmount: data.booking.totalAmount,
    paidAmount: isDeposit
      ? data.booking.depositAmount
      : data.booking.totalAmount,
    remainingAmount: isDeposit
      ? Math.max(0, data.booking.totalAmount - data.booking.depositAmount)
      : 0,
    balanceDueDate: isDeposit ? DUMMY_BALANCE_DUE_DATE : undefined,
  };
}
