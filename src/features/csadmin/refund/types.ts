export type RefundApiStatus =
  | "REQUESTED"
  | "REVIEWING"
  | "IN_REVIEW"
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
  email: string;
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
  bookedAt: string;
  useDate: string;
  adminMemo: string;
  historyCount: number;
  totalBookings: number;
};

export type CsRefundFormData = {
  reason: string;
  refundAmount: string;
  adminMemo: string;
  status: CsRefundStatus;
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
  REVIEWING: "정산 검토중",
  IN_REVIEW: "정산 검토중",
  APPROVED: "환불 승인",
  REJECTED: "반려",
  COMPLETED: "환불 완료",
};

export const toRefundFormData = (refund: CsRefund): CsRefundFormData => ({
  reason: refund.reason,
  refundAmount: String(refund.refundAmount),
  adminMemo: refund.adminMemo,
  status: refund.status,
  rejectReason: refund.rejectReason,
});

export const mockCsRefunds: CsRefund[] = [];
