import {
  formatGrowthRate,
  formatMonthLabel,
  formatWon,
  getMonthDateRange,
} from "@/features/moneyadmin/revenue/utils";

describe("정산매니저 월별 수익 유틸 테스트", () => {
  test("formatWon은 금액을 원화 문자열로 변환한다", () => {
    expect(formatWon(9800000)).toBe("9,800,000원");
  });

  test("formatMonthLabel은 월을 두 자리로 표시한다", () => {
    expect(formatMonthLabel(2026, 7)).toBe("2026.07");
    expect(formatMonthLabel(2026, 12)).toBe("2026.12");
  });

  test("formatGrowthRate는 양수에는 +를 붙이고 소수 첫째 자리까지 표시한다", () => {
    expect(formatGrowthRate(12.34)).toBe("+12.3%");
    expect(formatGrowthRate(-5.55)).toBe("-5.5%");
    expect(formatGrowthRate(0)).toBe("0.0%");
  });

  test("getMonthDateRange는 해당 월의 시작일과 마지막 일을 반환한다", () => {
    expect(getMonthDateRange(2026, 2)).toEqual({
      from: "2026-02-01",
      to: "2026-02-28",
    });
    expect(getMonthDateRange(2024, 2)).toEqual({
      from: "2024-02-01",
      to: "2024-02-29",
    });
  });

  test("getMonthDateRange는 유효하지 않은 연월이면 에러를 던진다", () => {
    expect(() => getMonthDateRange(2026, 0)).toThrow("유효하지 않은 연월입니다.");
    expect(() => getMonthDateRange(2026, 13)).toThrow("유효하지 않은 연월입니다.");
  });
});
