import type { RefundPolicyItem } from "./booking.types";

// 예약 조건 확인 영역에서 보여줄 취소/환불 정책.
// 2026-07-24 정책 확정 — 강의는 항상 환불 불가. 일시불은 패키지 전액을, 분할은 예약금 제외한
// 잔금만 아래 기준으로 환불
export const REFUND_POLICY: RefundPolicyItem[] = [
  { label: "출발 14일 전까지", description: "100% 환불", tone: "good" },
  { label: "출발 7~13일 전", description: "50% 환불", tone: "mid" },
  { label: "출발 7일 미만", description: "환불 불가", tone: "bad" },
];

// 강의 비용은 환불 불가, 일시불/분할 결제별 환불 대상이 다르다는 안내 — 정책 표 위에 함께 노출
export const REFUND_POLICY_NOTICE =
  "강의 비용은 환불되지 않습니다. 일시불 결제는 패키지 전액을, 분할 결제는 예약금을 제외한 잔금만 아래 기준으로 환불됩니다.";

// 국적/여권 종류는 현재 고정값으로 표시 (읽기 전용)
export const FIXED_NATIONALITY = "대한민국";
export const FIXED_PASSPORT_TYPE = "여권";
