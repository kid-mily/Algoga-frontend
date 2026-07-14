import type { ReservationItem } from "./reservation.types";

// 환불 요청 시 오늘 날짜로 기록할 더미 날짜 (실제 API 연동 전까지 고정값)
export const DUMMY_TODAY = "2026.07.13";

export const REFUND_REASON_MIN_LENGTH = 10;
export const REFUND_REASON_MAX_LENGTH = 500;

// 같은 탑승객 정보를 여러 예약에서 재사용한다 (디자인 확인용)
const DUMMY_PASSENGER = {
  lastName: "KIM",
  firstName: "MINJI",
  gender: "여성",
  birthDate: "2000.01.01",
  nationality: "대한민국",
  passportNumber: "M12345678",
  expiryDate: "2030.01.01",
};

// 예약 내역 디자인 확인용 더미 데이터 (실제 API 연동 없음, 새로고침하면 초기화됨)
export const DUMMY_RESERVATIONS: ReservationItem[] = [
  {
    id: 1,
    reservationNumber: "ALG-20260824-001",
    packageName: "도쿄 프리미엄 패키지",
    destination: "도쿄, 일본",
    startDate: "2026.08.24",
    endDate: "2026.08.28",
    duration: "4박 5일",
    airline: "대한항공",
    flightNumber: "KE123",
    departureAirport: "인천(ICN)",
    arrivalAirport: "도쿄 나리타(NRT)",
    departureTime: "09:00",
    arrivalTime: "11:40",
    accommodationName: "신주쿠 프린스 호텔",
    roomType: "디럭스 더블",
    paymentType: "full",
    totalAmount: 770000,
    paidAmount: 770000,
    remainingAmount: 0,
    depositPaidAt: "2026.07.13",
    status: "reserved",
    reservedAt: "2026.07.13",
    daysUntilDeparture: 42,
    passenger: DUMMY_PASSENGER,
  },
  {
    id: 2,
    reservationNumber: "ALG-20260910-002",
    packageName: "오사카 자유 여행 패키지",
    destination: "오사카, 일본",
    startDate: "2026.09.10",
    endDate: "2026.09.13",
    duration: "3박 4일",
    airline: "아시아나항공",
    flightNumber: "OZ112",
    departureAirport: "인천(ICN)",
    arrivalAirport: "간사이(KIX)",
    departureTime: "10:20",
    arrivalTime: "12:40",
    accommodationName: "호텔 몬토레 오사카",
    roomType: "스탠다드 트윈",
    paymentType: "installment",
    totalAmount: 680000,
    paidAmount: 204000,
    remainingAmount: 476000,
    depositPaidAt: "2026.07.05",
    balanceDueDate: "2026.09.03",
    status: "reserved",
    reservedAt: "2026.07.05",
    daysUntilDeparture: 10,
    passenger: DUMMY_PASSENGER,
  },
  {
    id: 3,
    reservationNumber: "ALG-20260716-005",
    packageName: "삿포로 미식 여행 패키지",
    destination: "삿포로, 일본",
    startDate: "2026.07.16",
    endDate: "2026.07.19",
    duration: "3박 4일",
    airline: "제주항공",
    flightNumber: "7C1102",
    departureAirport: "인천(ICN)",
    arrivalAirport: "신치토세(CTS)",
    departureTime: "08:10",
    arrivalTime: "11:00",
    accommodationName: "삿포로 그랜드 호텔",
    roomType: "스탠다드 트윈",
    paymentType: "full",
    totalAmount: 690000,
    paidAmount: 690000,
    remainingAmount: 0,
    depositPaidAt: "2026.06.20",
    status: "reserved",
    reservedAt: "2026.06.20",
    daysUntilDeparture: 3,
    passenger: DUMMY_PASSENGER,
  },
  {
    id: 4,
    reservationNumber: "ALG-20260512-003",
    packageName: "후쿠오카 힐링 패키지",
    destination: "후쿠오카, 일본",
    startDate: "2026.05.12",
    endDate: "2026.05.15",
    duration: "3박 4일",
    airline: "진에어",
    flightNumber: "LJ221",
    departureAirport: "인천(ICN)",
    arrivalAirport: "후쿠오카(FUK)",
    departureTime: "07:40",
    arrivalTime: "09:00",
    accommodationName: "하카타 엑셀 호텔 도큐",
    roomType: "스탠다드 더블",
    paymentType: "full",
    totalAmount: 590000,
    paidAmount: 590000,
    remainingAmount: 0,
    depositPaidAt: "2026.04.02",
    status: "completed",
    reservedAt: "2026.04.02",
    hasReview: false,
    passenger: DUMMY_PASSENGER,
  },
  {
    id: 5,
    reservationNumber: "ALG-20260620-006",
    packageName: "삿포로 겨울 패키지",
    destination: "삿포로, 일본",
    startDate: "2026.12.20",
    endDate: "2026.12.24",
    duration: "4박 5일",
    airline: "제주항공",
    flightNumber: "7C1102",
    departureAirport: "인천(ICN)",
    arrivalAirport: "신치토세(CTS)",
    departureTime: "08:10",
    arrivalTime: "11:00",
    accommodationName: "삿포로 그랜드 호텔",
    roomType: "스탠다드 트윈",
    paymentType: "full",
    totalAmount: 820000,
    paidAmount: 820000,
    remainingAmount: 0,
    depositPaidAt: "2026.06.01",
    status: "refund_pending",
    reservedAt: "2026.06.01",
    daysUntilDeparture: 30,
    refundReason: "개인 일정 변경으로 여행 참여가 어려워져 환불을 요청합니다.",
    refundRequestedAt: "2026.07.10",
    passenger: DUMMY_PASSENGER,
  },
  {
    id: 6,
    reservationNumber: "ALG-20260410-007",
    packageName: "후쿠오카 반나절 투어 패키지",
    destination: "후쿠오카, 일본",
    startDate: "2026.05.01",
    endDate: "2026.05.03",
    duration: "2박 3일",
    airline: "진에어",
    flightNumber: "LJ221",
    departureAirport: "인천(ICN)",
    arrivalAirport: "후쿠오카(FUK)",
    departureTime: "07:40",
    arrivalTime: "09:00",
    accommodationName: "하카타 엑셀 호텔 도큐",
    roomType: "스탠다드 더블",
    paymentType: "full",
    totalAmount: 420000,
    paidAmount: 420000,
    remainingAmount: 0,
    depositPaidAt: "2026.03.20",
    status: "refunded",
    reservedAt: "2026.03.20",
    refundReason: "숙소 컨디션 관련 우려로 환불을 요청합니다.",
    refundRequestedAt: "2026.04.02",
    refundedAt: "2026.04.05",
    passenger: DUMMY_PASSENGER,
  },
  {
    id: 7,
    reservationNumber: "ALG-20260715-008",
    packageName: "삿포로 미식 여행 패키지",
    destination: "삿포로, 일본",
    startDate: "2026.07.18",
    endDate: "2026.07.21",
    duration: "3박 4일",
    airline: "제주항공",
    flightNumber: "7C1102",
    departureAirport: "인천(ICN)",
    arrivalAirport: "신치토세(CTS)",
    departureTime: "08:10",
    arrivalTime: "11:00",
    accommodationName: "삿포로 그랜드 호텔",
    roomType: "스탠다드 트윈",
    paymentType: "full",
    totalAmount: 690000,
    paidAmount: 690000,
    remainingAmount: 0,
    depositPaidAt: "2026.06.10",
    status: "refund_rejected",
    reservedAt: "2026.06.10",
    daysUntilDeparture: 5,
    refundReason: "개인 일정 변경으로 여행 참여가 어려워졌습니다.",
    refundRequestedAt: "2026.07.13",
    refundRejectedReason: "여행 출발일이 임박하여 환불 가능 기간이 지났습니다.",
    refundRejectedAt: "2026.07.14",
    passenger: DUMMY_PASSENGER,
  },
];

interface StoredRefundRequest {
  id: number;
  reason: string;
  requestedAt: string;
}

const REFUND_REQUESTS_KEY = "algoga-mypage-refund-requests";

// 이번 세션에서 요청한 환불 목록을 세션에 기록해, 목록↔상세 페이지를 오가도 유지되게 한다
// (실제 API가 없어서 쓰는 임시 방식이며, 새로고침하면 초기화된다)
function getStoredRefundRequests(): StoredRefundRequest[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = sessionStorage.getItem(REFUND_REQUESTS_KEY);
    return stored ? (JSON.parse(stored) as StoredRefundRequest[]) : [];
  } catch {
    return [];
  }
}

// 환불 요청을 세션에 기록한다 (실제 API 연동 전 임시 저장소)
export function markReservationRefundRequested(
  reservationId: number,
  reason: string
) {
  if (typeof window === "undefined") return;

  const requests = getStoredRefundRequests();
  const withoutTarget = requests.filter((item) => item.id !== reservationId);

  sessionStorage.setItem(
    REFUND_REQUESTS_KEY,
    JSON.stringify([
      ...withoutTarget,
      { id: reservationId, reason, requestedAt: DUMMY_TODAY },
    ])
  );
}

// 더미 데이터에 이번 세션에서 요청한 환불 상태를 반영해서 반환한다
export function getReservationsWithSessionState(): ReservationItem[] {
  const requests = getStoredRefundRequests();

  return DUMMY_RESERVATIONS.map((item) => {
    const request = requests.find((entry) => entry.id === item.id);
    if (!request || item.status === "refund_pending") return item;

    return {
      ...item,
      status: "refund_pending" as const,
      refundReason: request.reason,
      refundRequestedAt: request.requestedAt,
      refundRejectedReason: undefined,
      refundRejectedAt: undefined,
      refundedAt: undefined,
    };
  });
}

// 출발일까지 남은 일수를 기준으로 환불 비율을 계산한다 (더미 daysUntilDeparture 값 기준, 실계산 아님)
export function getRefundRate(daysUntilDeparture?: number): number | null {
  if (daysUntilDeparture === undefined) return null;
  if (daysUntilDeparture >= 14) return 100;
  if (daysUntilDeparture >= 7) return 50;
  if (daysUntilDeparture >= 0) return 0;
  return null;
}

// 환불 요청 사유 유효성 검사 (필수 / 공백 제거 후 10~500자)
export function getRefundReasonError(reason: string): string | null {
  const trimmed = reason.trim();

  if (trimmed.length === 0 || trimmed.length < REFUND_REASON_MIN_LENGTH) {
    return `환불 요청 사유를 ${REFUND_REASON_MIN_LENGTH}자 이상 작성해 주세요.`;
  }
  if (trimmed.length > REFUND_REASON_MAX_LENGTH) {
    return `환불 요청 사유는 최대 ${REFUND_REASON_MAX_LENGTH}자까지 작성할 수 있습니다.`;
  }
  return null;
}
