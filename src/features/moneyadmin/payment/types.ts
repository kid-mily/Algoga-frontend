export type PaymentType =
  | "DEPOSIT"
  | "BALANCE"
  | "FULL"
  | "LECTURE"
  | "LECTURE_ONLY"
  | "PACKAGE"
  | "PACKAGE_FULL"
  | "PACKAGE_DEPOSIT"
  | "PACKAGE_BALANCE"
  | "UNKNOWN";

export type PaymentStatus =
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "PENDING"
  | "REFUNDED"
  | "UNKNOWN";

export type AdminPaymentApiRecord = {
  paymentId: number;
  bookingId?: number | null;
  courseId?: number | null;
  userId: number;
  paymentType: PaymentType;
  amount: number;
  usedMileage?: number | null;
  usedCouponId?: number | null;
  status: PaymentStatus;
  portonePaymentId?: string | null;
  createdAt: string;
  userName?: string | null;
  productName?: string | null;
  paymentMethod?: string | null;
};

export type AdminPayment = {
  paymentId: number;
  displayId: string;
  bookingId: number | null;
  courseId: number | null;
  userId: number;
  userName: string;
  productName: string;
  paymentType: PaymentType;
  paymentTypeLabel: string;
  amount: number;
  usedMileage: number;
  usedCouponId: number | null;
  status: PaymentStatus;
  statusLabel: string;
  portonePaymentId: string;
  createdAt: string;
  createdAtRaw: string;
  paymentMethod: string;
};

export const paymentTypeLabels: Record<PaymentType, string> = {
  LECTURE_ONLY: "단과결제",
  DEPOSIT: "예약금",
  BALANCE: "잔금",
  FULL: "일시불",
  LECTURE: "강의",
  PACKAGE: "패키지 결제",
  PACKAGE_FULL: "패키지 결제",
  PACKAGE_DEPOSIT: "패키지 결제",
  PACKAGE_BALANCE: "패키지 결제",
  UNKNOWN: "알 수 없음",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  SUCCESS: "결제 성공",
  FAILED: "결제 실패",
  CANCELLED: "결제 취소",
  PENDING: "결제 대기",
  REFUNDED: "환불 완료",
  UNKNOWN: "알 수 없음",
};

export const paymentStatusOptions = [
  { value: "ALL", label: "전체 상태" },
  { value: "SUCCESS", label: "결제 성공" },
  { value: "FAILED", label: "결제 실패" },
  { value: "CANCELLED", label: "결제 취소" },
  { value: "PENDING", label: "결제 대기" },
  { value: "REFUNDED", label: "환불 완료" },
] as const;

export const paymentTypeOptions = [
  { value: "ALL", label: "전체 유형" },
  { value: "DEPOSIT", label: "예약금" },
  { value: "BALANCE", label: "잔금" },
  { value: "FULL", label: "일시불" },
  { value: "LECTURE", label: "강의" },
] as const;
