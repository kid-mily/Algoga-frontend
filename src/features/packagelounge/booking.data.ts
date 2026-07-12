import type { RefundPolicyItem } from "./booking.types";

// 예약 조건 확인 영역에서 보여줄 취소/환불 정책 더미 데이터
export const REFUND_POLICY: RefundPolicyItem[] = [
  { label: "출발 15일 이전", description: "전액 환불", tone: "good" },
  { label: "출발 7~14일 이전", description: "50% 환불", tone: "mid" },
  { label: "출발 7일 이내", description: "환불 불가", tone: "bad" },
];

// 국적/여권 종류는 현재 고정값으로 표시 (읽기 전용)
export const FIXED_NATIONALITY = "대한민국";
export const FIXED_PASSPORT_TYPE = "여권";
