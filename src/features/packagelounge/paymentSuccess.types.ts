// 결제 완료 페이지에서 사용하는 타입 모음

// 기존 PackageBookingSummary.tsx에서 쓰던 결제 방식 값과 동일하게 맞춘다
export type PaymentMethod = "분할 결제" | "일시불";

export interface PaymentSuccessData {
  reservationNumber: string;
  reservationDate: string;
  paymentMode: PaymentMethod;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  airline: string;
  flightNumber: string;
  accommodationName: string;
  heroImage: string;
  // 강의를 함께 결제했을 때만 채워짐 (패키지 단독 결제면 둘 다 null)
  courseName: string | null;
  coursePrice: number | null;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  balanceDueDate?: string;
}
