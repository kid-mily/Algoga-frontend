export type RefundApiStatus =
  | "REQUESTED"
  | "UPPER_REVIEW"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | string;

export type CsRefundStatus =
  | "취소 요청"
  | "정산 검토중"
  | "환불 승인"
  | "반려"
  | "환불 완료";

export type RefundRequestApiRecord = {
  refundId: number;
  bookingId: number;
  paymentId: number;
  userId: number;
  status: RefundApiStatus;
  reason: string;
  rejectReason?: string | null;
  amount: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  productName: string;
  bookingNumber: string;
  checkInDate: string;
  paidAmount: number;
  paymentMethod: string;
};

export type CsRefund = {
  refundId: number;
  bookingId: string;
  bookingRawId: number;
  paymentId: number;
  userId: number;
  id: string;
  user: string;
  userLabel: string;
  product: string;
  requestedAt: string;
  requestDateTime: string;
  reason: string;
  rejectReason: string;
  status: CsRefundStatus;
  statusCode: RefundApiStatus;
  paymentAmount: number;
  refundAmount: number;
  paymentMethod: string;
  // 실제 예약/결제 생성 시각. 상세 조회 시 booking/payment API에서 따로 받아오고,
  // 그 호출이 실패하면(권한 등) 환불 요청 생성 시각으로 대체됩니다.
  bookingCreatedAt: string;
  paymentCreatedAt: string;
  useDate: string;
  adminMemo: string;
};

// status: 처리 상태 select의 값. ""는 "아직 아무것도 안 골랐다"는 뜻으로, 현재 상태 라벨을
// 그대로 넣으면 선택지 목록에 없어 select가 첫 옵션을 고른 것처럼 보이는 문제가 생겨서 분리했습니다.
export type CsRefundFormData = {
  reason: string;
  refundAmount: string;
  adminMemo: string;
  status: CsRefundStatus | "";
  rejectReason: string;
};

export const refundStatusOptions: Array<CsRefundStatus | "ALL"> = [
  "ALL",
  "취소 요청",
  "정산 검토중",
  "환불 승인",
  "반려",
  "환불 완료",
];

export const refundStatusLabel: Record<string, CsRefundStatus> = {
  REQUESTED: "취소 요청",
  UPPER_REVIEW: "정산 검토중",
  UNDER_REVIEW: "정산 검토중",
  APPROVED: "환불 승인",
  REJECTED: "반려",
  COMPLETED: "환불 완료",
};

// CS매니저 화면 전용: 최초 요청(REQUESTED) 단계에서만 CS 권한 액션(검토 요청/반려)이 있습니다.
// 정산 검토로 넘어간 뒤에는 정산매니저 화면이 담당이라 CS매니저 쪽엔 더 이상 액션이 없습니다.
export const getCsNextStatusOptions = (
  statusCode: RefundApiStatus
): CsRefundStatus[] => {
  const normalized = String(statusCode ?? "").trim().toUpperCase();

  if (normalized === "REQUESTED") {
    return ["정산 검토중", "반려"];
  }

  return [];
};

// 정산매니저 화면 전용: 정산 검토중 단계에서 CS 통과분을 재심사해 승인 또는 반려할 수 있습니다.
// 승인(APPROVED) 후에는 완료만 가능하고, 반려는 검토중 단계에서만 허용합니다.
export const getMoneyNextStatusOptions = (
  statusCode: RefundApiStatus
): CsRefundStatus[] => {
  const normalized = String(statusCode ?? "").trim().toUpperCase();

  if (normalized === "UPPER_REVIEW" || normalized === "UNDER_REVIEW") {
    return ["환불 승인", "반려"];
  }

  if (normalized === "APPROVED") {
    return ["환불 완료"];
  }

  return [];
};

export const toRefundFormData = (refund: CsRefund): CsRefundFormData => ({
  reason: refund.reason,
  refundAmount: String(refund.refundAmount),
  adminMemo: refund.adminMemo,
  status: refund.status,
  rejectReason: refund.rejectReason,
});

const getRequestedAtTime = (refund: CsRefund) => {
  const requestedTime = new Date(refund.requestDateTime).getTime();

  if (!Number.isNaN(requestedTime)) return requestedTime;

  const requestedDate = new Date(refund.requestedAt).getTime();

  return Number.isNaN(requestedDate) ? 0 : requestedDate;
};

export const sortRefundsByRequestedAtDesc = (refunds: CsRefund[]) =>
  [...refunds].sort((left, right) => {
    const timeDiff = getRequestedAtTime(right) - getRequestedAtTime(left);

    if (timeDiff !== 0) return timeDiff;

    return right.refundId - left.refundId;
  });

export const mockCsRefunds: CsRefund[] = [];
