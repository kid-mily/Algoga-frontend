import type { RefundPolicyItem } from "./booking.types";

// 예약 조건 확인 영역에서 보여줄 취소/환불 정책.
// 2026-07-23 정책 변경 — 예약금(계약금)과 강의는 환불 안 됨(몰수), 완납한 예약의 잔금만 아래 기준으로 환불
export const REFUND_POLICY: RefundPolicyItem[] = [
  { label: "출발 14일 전까지", description: "잔금 100% 환불", tone: "good" },
  { label: "출발 7~13일 전", description: "잔금 50% 환불", tone: "mid" },
  { label: "출발 7일 미만", description: "환불 불가", tone: "bad" },
];

// 예약금(계약금)과 강의는 환불되지 않는다는 안내 — 정책 표 위에 함께 노출
export const REFUND_POLICY_NOTICE =
  "예약금(계약금)과 강의는 환불되지 않습니다. 잔금만 아래 기준으로 환불됩니다.";

// 국적/여권 종류는 현재 고정값으로 표시 (읽기 전용)
export const FIXED_NATIONALITY = "대한민국";
export const FIXED_PASSPORT_TYPE = "여권";
