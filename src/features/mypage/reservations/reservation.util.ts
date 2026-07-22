import {
  createPayment,
  getAccommodationDetail,
  getBookingDetail,
  getMyBookings,
  getMyPayments,
} from "@/features/services/package.service";
import {
  cancelBooking,
  createRefundRequest,
  getMyRefundRequests,
  type RefundRequestRecord,
} from "@/features/services/refund.service";
import { ApiRequestError } from "@/lib/api";
import { requestTossPayment } from "@/features/services/portone.service";
import type {
  BookingDetail,
  AccommodationResponse,
  PaymentDetail,
} from "@/features/packagelounge/types";
import type { ReservationItem, ReservationStatus } from "./reservation.types";

// ISO 날짜("YYYY-MM-DD")를 화면에서 쓰는 점 표기("YYYY.MM.DD")로 바꾼다
function toDotDate(isoDate: string): string {
  return isoDate.slice(0, 10).replaceAll("-", ".");
}

// "2026-08-29T08:00:00" -> "2026-08-29 08:00" (원본에 날짜+시간이 다 있어서 문자열만 잘라 쓴다)
function toDateTimeLabel(isoDateTime: string): string {
  const [datePart, timePart] = isoDateTime.split("T");
  if (!datePart || !timePart) return isoDateTime;

  return `${datePart} ${timePart.slice(0, 5)}`;
}

// 잔금 결제 기한은 체크인일 7일 전까지 — 백엔드가 이 기한이 지나면 잔금 결제 자체를 막는다고 확인됨(2026-07-22)
function getBalanceDueInfo(
  checkInDate: string
): { label: string; isPastDue: boolean } {
  const [year, month, day] = checkInDate.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) {
    return { label: "출발일 7일 전", isPastDue: false };
  }

  const dueDate = new Date(Date.UTC(year, month - 1, day));
  dueDate.setUTCDate(dueDate.getUTCDate() - 7);

  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );

  return {
    label: toDotDate(dueDate.toISOString()),
    isPastDue: todayUtc.getTime() > dueDate.getTime(),
  };
}

// 예약(booking.status)은 결제 상태(DEPOSIT_PAID/FULL_PAID/CANCEL_REQUESTED/REFUNDED)만
// 나타내고 "이용 완료" 개념이 없어서, 체크아웃 날짜가 지났는지로 이용 전/이용 후를 프론트에서 직접 판단한다.
// 취소/환불된 예약은 환불 내역 탭에서 다루므로 여기서는 제외한다.
// PENDING(결제 없이 이탈한 예약)은 2026-07-21부터 백엔드가 GET /bookings/me 응답 자체에서
// 제외해주고 있어(백엔드 확인 완료), 프론트에서 따로 걸러내지 않는다
function resolveReservationStatus(
  booking: BookingDetail
): "reserved" | "completed" | null {
  if (
    booking.status === "CANCEL_REQUESTED" ||
    booking.status === "REFUNDED"
  ) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(booking.checkOutDate) < today ? "completed" : "reserved";
}

// 예약 폼이 "M"/"F" 토글로 고정 입력받으므로 한글 라벨로 매핑 (그 외 값/구예약은 원본 그대로 또는 "-")
function toGenderLabel(gender?: string | null): string {
  if (gender === "M") return "남";
  if (gender === "F") return "여";
  return gender || "-";
}

// gender/nationality는 2026-07-22부터 저장됨 — 이전에 생성된 예약은 값이 없어(null/누락) "-"로 대체 표시
function toReservationPassenger(booking: BookingDetail) {
  if (!booking.passengerInfo) return undefined;

  return {
    lastName: booking.passengerInfo.lastName,
    firstName: booking.passengerInfo.firstName,
    gender: toGenderLabel(booking.passengerInfo.gender),
    birthDate: booking.passengerInfo.birthDate,
    nationality: booking.passengerInfo.nationality ?? "-",
    passportNumber: booking.passengerInfo.passportNumber,
    expiryDate: booking.passengerInfo.passportExpiry,
  };
}

// 2026-07-22부터 booking.packageName이 내려와서 그걸 우선 쓰고, 없으면(패키지 경유가 아닌
// 예약 등) 숙소명으로 대체 표시한다
export function toReservationItem(
  booking: BookingDetail,
  accommodation: AccommodationResponse | null,
  payments: PaymentDetail[] = []
): ReservationItem | null {
  const status = resolveReservationStatus(booking);
  if (!status) return null;

  const bookingPayments = payments.filter(
    (payment) => payment.bookingId === booking.bookingId
  );
  const depositPayment = bookingPayments.find(
    (payment) => payment.paymentType.toUpperCase() === "DEPOSIT"
  );
  const isInstallment =
    booking.status === "DEPOSIT_PAID" || depositPayment !== undefined;
  const hasRemainingBalance =
    isInstallment && booking.status === "DEPOSIT_PAID";
  const remainingAmount = hasRemainingBalance ? booking.balancePrice : 0;
  const balanceDueInfo = hasRemainingBalance
    ? getBalanceDueInfo(booking.checkInDate)
    : null;

  return {
    id: booking.bookingId,
    reservationNumber: booking.bookingNumber,
    packageName: booking.packageName ?? accommodation?.name ?? "예약 패키지",
    destination: accommodation?.address ?? booking.flightInfo?.arrival ?? "",
    startDate: toDotDate(booking.checkInDate),
    endDate: toDotDate(booking.checkOutDate),
    duration: `${booking.nights}박 ${booking.nights + 1}일`,
    airline: booking.flightInfo?.airline ?? "",
    flightNumber: booking.flightInfo?.flightNumber ?? "",
    departureAirport: booking.flightInfo?.departure,
    arrivalAirport: booking.flightInfo?.arrival,
    departureTime: booking.flightInfo?.departureTime
      ? toDateTimeLabel(booking.flightInfo.departureTime)
      : undefined,
    arrivalTime: booking.flightInfo?.arrivalTime
      ? toDateTimeLabel(booking.flightInfo.arrivalTime)
      : undefined,
    returnAirline: booking.returnFlightInfo?.airline,
    returnFlightNumber: booking.returnFlightInfo?.flightNumber,
    returnDepartureAirport: booking.returnFlightInfo?.departure,
    returnArrivalAirport: booking.returnFlightInfo?.arrival,
    returnDepartureTime: booking.returnFlightInfo?.departureTime
      ? toDateTimeLabel(booking.returnFlightInfo.departureTime)
      : undefined,
    returnArrivalTime: booking.returnFlightInfo?.arrivalTime
      ? toDateTimeLabel(booking.returnFlightInfo.arrivalTime)
      : undefined,
    accommodationName: accommodation?.name ?? "",
    roomType: "",
    paymentType: isInstallment ? "installment" : "full",
    totalAmount: booking.totalPrice,
    paidAmount: booking.totalPrice - remainingAmount,
    remainingAmount,
    depositPaidAt: depositPayment
      ? toDotDate(depositPayment.createdAt)
      : undefined,
    balanceDueDate: balanceDueInfo?.label,
    balanceDeadlinePassed: balanceDueInfo?.isPastDue ?? false,
    status,
    reservedAt: toDotDate(booking.createdAt),
    passenger: toReservationPassenger(booking),
  };
}

// GET /refund-requests/me의 status를 화면에서 쓰는 3단계로 매핑한다
// (REQUESTED/UPPER_REVIEW/UNDER_REVIEW/APPROVED는 아직 처리 중이라 전부 "환불 처리 중"으로 묶는다)
function toRefundReservationStatus(status: string): ReservationStatus {
  const normalized = status.trim().toUpperCase();

  if (normalized === "COMPLETED") return "refunded";
  if (normalized === "REJECTED") return "refund_rejected";
  return "refund_pending";
}

// 환불 요청 한 건(GET /refund-requests/me)을 예약 내역 카드 형태로 변환한다.
// 여행 일정/항공/숙소 정보는 이 응답에 없어서 원래 예약(booking)을 추가로 조회해서 채운다
async function toRefundReservationItem(
  refund: RefundRequestRecord,
  signal?: AbortSignal,
  payments: PaymentDetail[] = []
): Promise<ReservationItem> {
  const booking = await getBookingDetail(refund.bookingId, signal).catch(
    () => null
  );
  const accommodation = booking
    ? await getAccommodationDetail(booking.accommodationId, signal).catch(
        () => null
      )
    : null;

  const status = toRefundReservationStatus(refund.status);
  const depositPayment = payments.find(
    (payment) =>
      payment.bookingId === refund.bookingId &&
      payment.paymentType.toUpperCase() === "DEPOSIT"
  );

  return {
    id: refund.bookingId,
    reservationNumber:
      refund.bookingNumber ||
      booking?.bookingNumber ||
      `BK${String(refund.bookingId).padStart(6, "0")}`,
    packageName:
      refund.productName ||
      booking?.packageName ||
      accommodation?.name ||
      "예약 패키지",
    destination: accommodation?.address ?? booking?.flightInfo?.arrival ?? "",
    startDate: booking
      ? toDotDate(booking.checkInDate)
      : refund.checkInDate
        ? toDotDate(refund.checkInDate)
        : "",
    endDate: booking ? toDotDate(booking.checkOutDate) : "",
    duration: booking ? `${booking.nights}박 ${booking.nights + 1}일` : "",
    airline: booking?.flightInfo?.airline ?? "",
    flightNumber: booking?.flightInfo?.flightNumber ?? "",
    departureAirport: booking?.flightInfo?.departure,
    arrivalAirport: booking?.flightInfo?.arrival,
    departureTime: booking?.flightInfo?.departureTime
      ? toDateTimeLabel(booking.flightInfo.departureTime)
      : undefined,
    arrivalTime: booking?.flightInfo?.arrivalTime
      ? toDateTimeLabel(booking.flightInfo.arrivalTime)
      : undefined,
    returnAirline: booking?.returnFlightInfo?.airline,
    returnFlightNumber: booking?.returnFlightInfo?.flightNumber,
    returnDepartureAirport: booking?.returnFlightInfo?.departure,
    returnArrivalAirport: booking?.returnFlightInfo?.arrival,
    returnDepartureTime: booking?.returnFlightInfo?.departureTime
      ? toDateTimeLabel(booking.returnFlightInfo.departureTime)
      : undefined,
    returnArrivalTime: booking?.returnFlightInfo?.arrivalTime
      ? toDateTimeLabel(booking.returnFlightInfo.arrivalTime)
      : undefined,
    accommodationName: accommodation?.name ?? "",
    roomType: "",
    paymentType: depositPayment ? "installment" : "full",
    totalAmount: booking?.totalPrice ?? refund.paidAmount ?? refund.amount,
    paidAmount: refund.paidAmount ?? booking?.totalPrice ?? refund.amount,
    remainingAmount: 0,
    depositPaidAt: depositPayment
      ? toDotDate(depositPayment.createdAt)
      : undefined,
    status,
    reservedAt: booking ? toDotDate(booking.createdAt) : toDotDate(refund.createdAt),
    passenger: booking ? toReservationPassenger(booking) : undefined,
    refundReason: refund.reason,
    refundRequestedAt: toDotDate(refund.createdAt),
    refundRejectedReason:
      status === "refund_rejected" ? (refund.rejectReason ?? undefined) : undefined,
    refundRejectedAt:
      status === "refund_rejected" ? toDotDate(refund.updatedAt) : undefined,
    refundedAt: status === "refunded" ? toDotDate(refund.updatedAt) : undefined,
  };
}

// 내 예약 목록(GET /bookings/me) + 내 환불 요청 목록(GET /refund-requests/me)을 합쳐
// 화면에서 쓰는 형태로 변환한다. 숙소명은 예약 응답에 없어 accommodationId별로 별도 조회해서 채운다.
// 취소/환불 예약(CANCEL_REQUESTED/REFUNDED)은 booking 쪽에서 걸러지고, 대신 환불 요청 쪽에서 채워진다
export async function loadMyReservations(
  signal?: AbortSignal
): Promise<ReservationItem[]> {
  const [bookings, refunds, payments] = await Promise.all([
    getMyBookings(undefined, signal),
    getMyRefundRequests(signal).catch(() => []),
    getMyPayments(signal).catch(() => []),
  ]);

  const accommodationIds = Array.from(
    new Set(bookings.map((booking) => booking.accommodationId))
  );

  const accommodations = await Promise.all(
    accommodationIds.map((id) =>
      getAccommodationDetail(id, signal).catch(() => null)
    )
  );

  const accommodationById = new Map(
    accommodationIds.map((id, index) => [id, accommodations[index]])
  );

  const activeItems = bookings
    .map((booking) =>
      toReservationItem(
        booking,
        accommodationById.get(booking.accommodationId) ?? null,
        payments
      )
    )
    .filter((item): item is ReservationItem => item !== null);

  const refundItems = await Promise.all(
    refunds.map((refund) => toRefundReservationItem(refund, signal, payments))
  );

  return [...activeItems, ...refundItems];
}

// 예약 상세: 활성 예약(reserved/completed)이면 booking으로, 취소/환불된 예약이면
// 매칭되는 환불 요청(GET /refund-requests/me)으로 채운다
export async function loadMyReservationDetail(
  bookingId: number,
  signal?: AbortSignal
): Promise<ReservationItem | null> {
  const booking = await getBookingDetail(bookingId, signal);
  const status = resolveReservationStatus(booking);

  if (!status) {
    const [refunds, payments] = await Promise.all([
      getMyRefundRequests(signal).catch(() => []),
      getMyPayments(signal).catch(() => []),
    ]);
    const matched = refunds.find((refund) => refund.bookingId === bookingId);

    return matched
      ? toRefundReservationItem(matched, signal, payments)
      : null;
  }

  const accommodation = await getAccommodationDetail(
    booking.accommodationId,
    signal
  ).catch(() => null);
  const payments = await getMyPayments(signal).catch(() => []);

  return toReservationItem(booking, accommodation, payments);
}

export async function payReservationBalance(
  bookingId: number,
  signal?: AbortSignal
): Promise<void> {
  const booking = await getBookingDetail(bookingId, signal);

  if (!booking.installmentAllowed) {
    throw new Error("일시불 전용 예약은 잔금 결제를 진행할 수 없습니다.");
  }

  if (booking.status !== "DEPOSIT_PAID") {
    throw new Error("예약금 결제가 완료된 예약만 잔금을 결제할 수 있습니다.");
  }

  if (getBalanceDueInfo(booking.checkInDate).isPastDue) {
    throw new Error(
      "잔금 결제 기한(출발 7일 전)이 지나 결제할 수 없습니다. 고객센터로 문의해 주세요."
    );
  }

  const amount = booking.balancePrice;
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("결제할 잔금이 없습니다.");
  }

  const portonePaymentId =
    await requestTossPayment({
      orderName: `예약 ${bookingId} 잔금`,
      totalAmount: amount,
    });

  await createPayment(
    {
      bookingId,
      paymentType: "BALANCE",
      amount,
      usedMileage: 0,
      usedCouponId: null,
      portonePaymentId,
    },
    signal
  );
}

// 백엔드 응답의 errorCode별 안내 문구 (예약 취소 + 환불 요청 공용)
const REFUND_ERROR_MESSAGE: Record<string, string> = {
  BK_001: "예약 정보를 찾을 수 없습니다.",
  REF_002: "예약 정보를 찾을 수 없습니다.",
  REF_004: "이미 환불 요청된 예약입니다.",
  REF_006: "취소된 예약만 환불 요청이 가능합니다.",
};

function toRefundErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    const errorCode = (error.body as { errorCode?: string } | null)?.errorCode;
    return (
      (errorCode && REFUND_ERROR_MESSAGE[errorCode]) ||
      error.message ||
      "환불 요청에 실패했습니다."
    );
  }

  return error instanceof Error ? error.message : "환불 요청에 실패했습니다.";
}

// 예약 취소(DELETE /bookings/{id}/cancel) + 환불 요청 생성(POST /refund-requests)을 순서대로 처리한다.
// paymentId는 별도 조회 API가 없어서 GET /payments/me 전체를 가져와 bookingId로 찾는다
// (예약금+잔금처럼 결제가 여러 건이면 가장 최근 결제를 기준으로 함)
export async function submitRefundRequest(
  bookingId: number,
  reason: string,
  signal?: AbortSignal
): Promise<void> {
  try {
    const payments = await getMyPayments(signal);
    const matchedPayments = payments.filter(
      (payment) => payment.bookingId === bookingId
    );

    if (matchedPayments.length === 0) {
      throw new Error(
        "이 예약의 결제 정보를 찾을 수 없어 환불 요청을 진행할 수 없습니다. 고객센터로 문의해 주세요."
      );
    }

    const latestPayment = matchedPayments.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest
    );

    await cancelBooking(bookingId, signal);
    await createRefundRequest(
      { bookingId, paymentId: latestPayment.paymentId, reason },
      signal
    );
  } catch (error) {
    throw new Error(toRefundErrorMessage(error));
  }
}
