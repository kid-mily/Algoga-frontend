import {
  getAccommodationDetail,
  getBookingDetail,
  getMyBookings,
} from "@/features/services/package.service";
import type { BookingDetail, AccommodationResponse } from "@/features/packagelounge/types";
import type { ReservationItem } from "./reservation.types";

// ISO 날짜("YYYY-MM-DD")를 화면에서 쓰는 점 표기("YYYY.MM.DD")로 바꾼다
function toDotDate(isoDate: string): string {
  return isoDate.slice(0, 10).replaceAll("-", ".");
}

// 예약(booking.status)은 결제 상태(PENDING/DEPOSIT_PAID/FULL_PAID/CANCEL_REQUESTED/REFUNDED)만
// 나타내고 "이용 완료" 개념이 없어서, 체크아웃 날짜가 지났는지로 이용 전/이용 후를 프론트에서 직접 판단한다.
// 취소/환불된 예약은 환불 내역 탭(아직 더미)에서 다루므로 여기서는 제외한다.
function resolveReservationStatus(
  booking: BookingDetail
): "reserved" | "completed" | null {
  if (booking.status === "CANCEL_REQUESTED" || booking.status === "REFUNDED") {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(booking.checkOutDate) < today ? "completed" : "reserved";
}

// 예약(booking)에는 상품명/좌석 타입이 없어(숙소·항공만 저장) 숙소명으로 대체 표시한다
export function toReservationItem(
  booking: BookingDetail,
  accommodation: AccommodationResponse | null
): ReservationItem | null {
  const status = resolveReservationStatus(booking);
  if (!status) return null;

  const isInstallment = booking.status === "DEPOSIT_PAID";

  return {
    id: booking.bookingId,
    reservationNumber: booking.bookingNumber,
    packageName: accommodation?.name ?? "예약 패키지",
    destination: accommodation?.address ?? booking.flightInfo?.arrival ?? "",
    startDate: toDotDate(booking.checkInDate),
    endDate: toDotDate(booking.checkOutDate),
    duration: `${booking.nights}박 ${booking.nights + 1}일`,
    airline: booking.flightInfo?.airline ?? "",
    flightNumber: booking.flightInfo?.flightNumber ?? "",
    departureAirport: booking.flightInfo?.departure,
    arrivalAirport: booking.flightInfo?.arrival,
    departureTime: booking.flightInfo?.departureTime,
    arrivalTime: booking.flightInfo?.arrivalTime,
    accommodationName: accommodation?.name ?? "",
    roomType: "",
    paymentType: isInstallment ? "installment" : "full",
    totalAmount: booking.totalPrice,
    paidAmount: isInstallment ? booking.depositPrice : booking.totalPrice,
    remainingAmount: isInstallment ? booking.balancePrice : 0,
    status,
    reservedAt: toDotDate(booking.createdAt),
    // 백엔드가 성별/국적을 받지 않아 표시할 값이 없다
    passenger: booking.passengerInfo
      ? {
          lastName: booking.passengerInfo.lastName,
          firstName: booking.passengerInfo.firstName,
          gender: "-",
          birthDate: booking.passengerInfo.birthDate,
          nationality: "-",
          passportNumber: booking.passengerInfo.passportNumber,
          expiryDate: booking.passengerInfo.passportExpiry,
        }
      : undefined,
  };
}

// 내 예약 목록(GET /bookings/me)을 조회해 화면에서 쓰는 형태로 변환한다.
// 숙소명은 예약 응답에 없어 accommodationId별로 별도 조회해서 채운다
export async function loadMyReservations(
  signal?: AbortSignal
): Promise<ReservationItem[]> {
  const bookings = await getMyBookings(undefined, signal);

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

  return bookings
    .map((booking) =>
      toReservationItem(
        booking,
        accommodationById.get(booking.accommodationId) ?? null
      )
    )
    .filter((item): item is ReservationItem => item !== null);
}

// 예약 상세: 실제 예약(bookingId)이면 이걸로 조회하고, 없으면(더미 환불 항목 등) null을 반환한다
export async function loadMyReservationDetail(
  bookingId: number,
  signal?: AbortSignal
): Promise<ReservationItem | null> {
  const booking = await getBookingDetail(bookingId, signal);
  const accommodation = await getAccommodationDetail(
    booking.accommodationId,
    signal
  ).catch(() => null);

  return toReservationItem(booking, accommodation);
}
