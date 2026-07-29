import { ApiRequestError } from "@/lib/api";
import {
  formatDateInputValue,
  formatDateTime,
  formatPaymentError,
  formatWon,
  getDefaultPaymentDateRange,
} from "@/features/moneyadmin/payment/utils";

describe("정산매니저 결제 유틸 테스트", () => {
  test("formatWon은 금액을 원화 문자열로 변환한다", () => {
    expect(formatWon(1200000)).toBe("1,200,000원");
    expect(formatWon(0)).toBe("0원");
  });

  test("formatDateTime은 날짜 문자열을 화면 표시 형식으로 변환한다", () => {
    expect(formatDateTime(undefined)).toBe("-");
    expect(formatDateTime("not-date")).toBe("not-date");
    expect(formatDateTime("2026-07-20T09:05:00")).toBe("2026.07.20 09:05");
  });

  test("formatDateInputValue는 Date를 input date 값으로 변환한다", () => {
    expect(formatDateInputValue(new Date(2026, 6, 5))).toBe("2026-07-05");
  });

  test("getDefaultPaymentDateRange는 이번 달 1일부터 오늘까지의 범위를 반환한다", () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 6, 20));

    expect(getDefaultPaymentDateRange()).toEqual({
      from: "2026-07-01",
      to: "2026-07-20",
    });

    jest.useRealTimers();
  });

  test("formatPaymentError는 ApiRequestError 정보를 포함해 메시지를 만든다", () => {
    const error = new ApiRequestError({
      message: "서버 내부 오류",
      status: 500,
      code: "GLOBAL_001",
      url: "/api/v1/admin/payments",
    });

    const message = formatPaymentError(error, "결제 내역을 불러오지 못했습니다.");

    expect(message).toContain("결제 내역을 불러오지 못했습니다.");
    expect(message).toContain("상태: 500");
    expect(message).toContain("코드: GLOBAL_001");
    expect(message).toContain("메시지: 서버 내부 오류");
  });

  test("formatPaymentError는 일반 Error면 Error 메시지를 반환한다", () => {
    expect(
      formatPaymentError(new Error("네트워크 오류"), "결제 내역을 불러오지 못했습니다.")
    ).toBe("네트워크 오류");
  });
});
