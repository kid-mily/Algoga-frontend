import { ApiRequestError } from "@/lib/api";
import { getErrorMessage } from "@/features/services/error.service";

// 완료(/complete) 등 환불 처리에서 나올 수 있는 도메인 에러 코드 → 사용자 안내 문구.
// 결제 정보 없음은 PAY_001이 아니라 REF_003(환불 도메인 코드)로 내려온다.
const REFUND_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  REF_001: "환불 요청을 찾을 수 없습니다.",
  REF_002: "예약 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.",
  REF_003: "결제 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.",
  // 승인(APPROVED) 상태가 아님 — 상태 불일치. 목록 새로고침 유도.
  REF_005: "승인된 환불만 완료할 수 있습니다. 목록을 새로고침해주세요.",
  // PAY_005·PAY_014는 원인이 같은 PG(PortOne) 연동 실패라 같은 재시도 안내 그룹으로 묶는다.
  // (PAY_005가 반복되면 서킷브레이커가 열려 PAY_014로 바뀌고, 약 10초 후 자동 복구된다.)
  PAY_005: "결제사 오류로 환불에 실패했습니다. 잠시 후 다시 시도해주세요.",
  PAY_014: "결제 서비스가 일시 중단되었습니다. 10초 후 다시 시도해주세요.",
};

// 백엔드 에러 응답은 `errorCode` 필드로 코드를 내려주는데, 공용 api 레이어는 `result.code`만
// 읽어 ApiRequestError.code가 비어 있을 수 있습니다. 그래서 body에서 errorCode도 함께 확인합니다.
const extractErrorCode = (error: unknown): string | undefined => {
  if (!(error instanceof ApiRequestError)) return undefined;

  if (error.code) return error.code;

  const body = error.body;

  if (body && typeof body === "object" && "errorCode" in body) {
    const errorCode = (body as { errorCode?: unknown }).errorCode;

    if (typeof errorCode === "string") return errorCode;
  }

  return undefined;
};

export const formatRefundError = (error: unknown, fallbackMessage: string) => {
  const code = extractErrorCode(error);

  if (code && REFUND_ERROR_MESSAGE_BY_CODE[code]) {
    return REFUND_ERROR_MESSAGE_BY_CODE[code];
  }

  return getErrorMessage(error, fallbackMessage);
};

export const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;
