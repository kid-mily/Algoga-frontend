import type { CourseItem } from "@/features/classroom/components/types";
import type { PackageDetailData } from "./packageDetail.types";
import type { BookingDetail } from "./types";
import type { PaymentMethod, PaymentSuccessData } from "./paymentSuccess.types";

// ISO 날짜("YYYY-MM-DD...")를 화면에서 쓰는 점 표기("YYYY.MM.DD")로 바꾼다
function toDotDate(isoDate: string): string {
  return isoDate.slice(0, 10).replaceAll("-", ".");
}

interface BuildPaymentSuccessDataOptions {
  // 실제 결제된 예약(GET /bookings/{id}) — bookingNumber/createdAt/totalPrice 등 실 데이터
  booking: BookingDetail;
  // 강의를 함께 결제한 경우에만 존재
  course: CourseItem | null;
  // 실제로 결제창에 띄웠던 금액(usePackagePayment의 finalAmount). 있으면 이 값을 그대로 쓰고,
  // 없을 때만(예: 쿼리 파라미터 누락) 패키지+강의 정가로 대체 계산한다
  paidAmount: number | null;
}

// 결제 완료 페이지에 보여줄 데이터를 만든다. 패키지 카탈로그 가격이 아니라
// 실제 예약/결제 데이터를 기준으로 계산한다 (강의를 같이 샀으면 강의 금액도 포함됨)
export function buildPaymentSuccessData(
  paymentMode: PaymentMethod,
  data: PackageDetailData,
  { booking, course, paidAmount }: BuildPaymentSuccessDataOptions
): PaymentSuccessData {
  const outboundFlight = data.flights[0];
  const isDeposit = paymentMode === "분할 결제";
  const coursePrice = course?.price ?? 0;

  // 총 여정 금액(참고용, 할인 적용 전): 패키지 전체가 + 강의 정가
  const totalAmount = booking.totalPrice + coursePrice;
  // paidAmount(실제 결제창에 띄웠던 금액)를 못 받은 경우에만 쓰는 대체 계산 —
  // 쿠폰/마일리지 할인은 반영되지 않아 실제 결제액보다 클 수 있음
  const fallbackPaidAmount =
    (isDeposit ? booking.depositPrice : booking.totalPrice) + coursePrice;

  return {
    reservationNumber: booking.bookingNumber,
    reservationDate: toDotDate(booking.createdAt),
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
    courseName: course?.title ?? null,
    coursePrice: course ? coursePrice : null,
    totalAmount,
    paidAmount: paidAmount ?? fallbackPaidAmount,
    // 강의는 분할 없이 항상 즉시 전액 결제되므로, 분할(예약금)일 때 남는 금액은
    // 패키지분 잔금(balancePrice)뿐이다
    remainingAmount: isDeposit ? booking.balancePrice : 0,
    // 잔금 결제 기한을 내려주는 API 필드가 아직 없어 비워둔다 (더미로 채우지 않음)
    balanceDueDate: undefined,
  };
}
