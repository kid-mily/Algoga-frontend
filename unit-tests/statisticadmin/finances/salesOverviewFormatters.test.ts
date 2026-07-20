import {
  formatKoreanMoney,
  formatMillionAmount,
  formatPercentValue,
  formatRateValue,
  getSalesOverviewDateRange,
  getSalesTrendUnit,
  periodLabels,
  salesOverviewPeriods,
  toMillionValue,
} from "@/features/statisticadmin/finances/utils/salesOverviewFormatters";

describe("재무현황 포맷터 테스트", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("기간별 차트 단위를 반환한다", () => {
    expect(getSalesTrendUnit("today")).toBe("HOUR");
    expect(getSalesTrendUnit("thisWeek")).toBe("DAY");
    expect(getSalesTrendUnit("thisMonth")).toBe("DAY");
    expect(getSalesTrendUnit("thisYear")).toBe("MONTH");
  });

  test("기간 옵션과 라벨을 제공한다", () => {
    expect(salesOverviewPeriods).toEqual([
      "today",
      "thisWeek",
      "thisMonth",
      "thisYear",
    ]);
    expect(periodLabels.thisMonth).toBe("이번달");
  });

  test("선택 기간에 맞는 조회 날짜 범위를 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T09:00:00+09:00"));

    expect(getSalesOverviewDateRange("today")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });
    expect(getSalesOverviewDateRange("thisWeek")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });
    expect(getSalesOverviewDateRange("thisMonth")).toEqual({
      from: "2026-07-01",
      to: "2026-07-20",
    });
    expect(getSalesOverviewDateRange("thisYear")).toEqual({
      from: "2026-01-01",
      to: "2026-07-20",
    });
  });

  test("금액과 비율을 화면 표시 형식으로 변환한다", () => {
    expect(formatKoreanMoney(2_340_000_000)).toBe("23.4억원");
    expect(formatKoreanMoney(84_500_000)).toBe("8450만원");
    expect(formatKoreanMoney(900)).toBe("900원");
    expect(formatKoreanMoney(Number.NaN)).toBe("0원");

    expect(formatMillionAmount(184_000_000)).toBe("184M");
    expect(formatPercentValue(12.4)).toBe("+12.4%");
    expect(formatPercentValue(-5.2)).toBe("-5.2%");
    expect(formatRateValue(4.8)).toBe("4.8%");
    expect(toMillionValue(184_400_000)).toBe(184);
  });
});
