import {
  formatMillionAmount,
  formatPercent,
  formatWon,
  getRefundDateRange,
  getStatusClassName,
  getTrendUnit,
} from "@/features/statisticadmin/refund/utils";

describe("환불 관리 유틸 테스트", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T09:00:00+09:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("금액과 비율 표시 형식을 변환한다", () => {
    expect(formatWon(2_341_000_000)).toBe("2,341,000,000원");
    expect(formatPercent(4.8)).toBe("4.8%");
    expect(formatMillionAmount(75_000_000)).toBe("75M");
  });

  test("기간 프리셋에 맞는 조회 기간을 만든다", () => {
    expect(getRefundDateRange("today")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(getRefundDateRange("thisWeek")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(getRefundDateRange("thisMonth")).toEqual({
      from: "2026-07-01",
      to: "2026-07-20",
    });

    expect(getRefundDateRange("thisYear")).toEqual({
      from: "2026-01-01",
      to: "2026-07-20",
    });
  });

  test("기간별 차트 단위를 반환한다", () => {
    expect(getTrendUnit("today")).toBe("HOUR");
    expect(getTrendUnit("thisWeek")).toBe("DAY");
    expect(getTrendUnit("thisMonth")).toBe("DAY");
    expect(getTrendUnit("thisYear")).toBe("MONTH");
  });

  test("나라별 환불율 상태 색상을 반환한다", () => {
    expect(getStatusClassName("위험")).toContain("text-[#EF4444]");
    expect(getStatusClassName("주의")).toContain("text-[#F59E0B]");
    expect(getStatusClassName("양호")).toContain("text-[#2FAE9B]");
  });
});
