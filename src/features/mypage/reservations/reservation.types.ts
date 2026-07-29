// 예약 내역 페이지에서 사용하는 타입 모음

// reserved: 예약 완료(이용 전) / completed: 이용 완료
// refund_pending/refunded/refund_rejected: 환불 요청 이후 상태
export type ReservationStatus =
  | "reserved"
  | "completed"
  | "refund_pending"
  | "refunded"
  | "refund_rejected";

export type PaymentType = "full" | "installment";

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  reserved: "예약 완료",
  completed: "이용 완료",
  refund_pending: "환불 처리 중",
  refunded: "환불 완료",
  refund_rejected: "환불 반려",
};

// 상태를 색상에만 의존하지 않도록 라벨과 함께 사용하는 배지 색상 (연한 배경 + 진한 글자)
export const RESERVATION_STATUS_BADGE_CLASS: Record<ReservationStatus, string> = {
  reserved: "bg-[#EEF8F7] text-[#439A97]",
  completed: "bg-[#F3F8FC] text-[#718096]",
  refund_pending: "bg-[#FFF3E8] text-[#B8631C]",
  refunded: "bg-[#F3F8FC] text-[#718096]",
  refund_rejected: "bg-[#FDECEC] text-[#B54747]",
};

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  full: "일시불",
  installment: "분할 결제",
};

// 예약자(탑승객) 정보 - 읽기 전용으로만 표시한다
export interface ReservationPassenger {
  lastName: string;
  firstName: string;
  gender: string;
  birthDate: string;
  nationality: string;
  passportNumber: string;
  expiryDate: string;
}

export interface ReservationItem {
  id: number;
  reservationNumber: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  airline: string;
  flightNumber: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
  arrivalTime?: string;
  // 오는 편(returnFlightInfo) — 왕복이 아니거나 정보가 없으면 전부 undefined
  returnAirline?: string;
  returnFlightNumber?: string;
  returnDepartureAirport?: string;
  returnArrivalAirport?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  accommodationName: string;
  roomType: string;

  paymentType: PaymentType;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  depositPaidAt?: string;
  balanceDueDate?: string;
  // 잔금 결제 기한(출발 7일 전)이 이미 지났는지 — 지났으면 백엔드가 결제를 막으므로
  // "잔금 결제하기" 버튼 자체를 노출하지 않는다
  balanceDeadlinePassed?: boolean;

  status: ReservationStatus;
  reservedAt: string;

  // 이용 전 예약의 출발일까지 남은 일수 (환불 비율 계산 기준, 디자인 확인용 고정값)
  daysUntilDeparture?: number;
  // 이미 후기를 작성했는지 (디자인 확인용)
  hasReview?: boolean;
  passenger?: ReservationPassenger;

  // 사용자가 작성한 환불 요청 사유 (관리자 반려 사유와 절대 혼동하지 않도록 분리 관리)
  refundReason?: string;
  refundRequestedAt?: string;

  refundedAt?: string;

  // 관리자가 입력한 반려 사유 (사용자 작성 사유와 다른 필드)
  refundRejectedReason?: string;
  refundRejectedAt?: string;
}

export type ReservationTab = "upcoming" | "completed" | "refund";

export interface RefundRequestPayload {
  reservationId: number;
  reason: string;
}
