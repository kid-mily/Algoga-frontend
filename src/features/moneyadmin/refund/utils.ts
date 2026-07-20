import { ApiRequestError } from "@/lib/api";
import { getErrorMessage } from "@/features/services/error.service";

// PG(PortOne) 연동 실패는 사용자 조작 실수가 아니라 결제 서비스 쪽 문제라,
// 서버 메시지 대신 재시도 안내 문구로 바꿔 보여줍니다.
const REFUND_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  // 완료(/complete) 시 PortOne 결제 취소 호출이 거부됨 (실결제가 아닌 건 등)
  PAY_005: "결제 취소 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  // PortOne 서킷브레이커 차단 — 약 10초 후 자동 복구됩니다.
  PAY_014: "결제 서비스가 일시적으로 중단되었습니다. 약 10초 후 다시 시도해주세요.",
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
