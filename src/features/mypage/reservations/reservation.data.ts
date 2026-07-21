export const REFUND_REASON_MIN_LENGTH = 10;
export const REFUND_REASON_MAX_LENGTH = 500;

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
