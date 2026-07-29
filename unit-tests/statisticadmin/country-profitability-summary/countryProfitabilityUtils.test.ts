import {
  countryProfitPeriodLabels,
  countryProfitPeriods,
  formatBookingCount,
  formatManwon,
  formatPercent,
  getCountryProfitDateRange,
  getRateTextColor,
} from "@/features/statisticadmin/country-profitability-summary/utils";

describe("나라별 수익성 유틸 테스트", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("기간 옵션과 라벨을 제공한다", () => {
    expect(countryProfitPeriods).toEqual([
      "TODAY",
      "THIS_WEEK",
      "THIS_MONTH",
      "THIS_YEAR",
    ]);

    expect(countryProfitPeriodLabels.TODAY).toBe("오늘");
    expect(countryProfitPeriodLabels.THIS_WEEK).toBe("이번주");
    expect(countryProfitPeriodLabels.THIS_MONTH).toBe("이번달");
    expect(countryProfitPeriodLabels.THIS_YEAR).toBe("올해");
  });

  test("오늘 조회 기간을 한국 시간 기준으로 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(
      new Date("2026-07-22T09:00:00+09:00")
    );

    expect(getCountryProfitDateRange("TODAY")).toEqual({
      from: "2026-07-22",
      to: "2026-07-22",
    });
  });

  test("이번 주는 월요일부터 오늘까지 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(
      new Date("2026-07-22T09:00:00+09:00")
    );

    expect(
      getCountryProfitDateRange("THIS_WEEK")
    ).toEqual({
      from: "2026-07-20",
      to: "2026-07-22",
    });
  });

  test("일요일에는 직전 월요일을 이번 주 시작일로 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(
      new Date("2026-07-26T09:00:00+09:00")
    );

    expect(
      getCountryProfitDateRange("THIS_WEEK")
    ).toEqual({
      from: "2026-07-20",
      to: "2026-07-26",
    });
  });

  test("이번 달은 월의 첫날부터 오늘까지 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(
      new Date("2026-07-22T09:00:00+09:00")
    );

    expect(
      getCountryProfitDateRange("THIS_MONTH")
    ).toEqual({
      from: "2026-07-01",
      to: "2026-07-22",
    });
  });

  test("올해는 1월 1일부터 오늘까지 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(
      new Date("2026-07-22T09:00:00+09:00")
    );

    expect(
      getCountryProfitDateRange("THIS_YEAR")
    ).toEqual({
      from: "2026-01-01",
      to: "2026-07-22",
    });
  });

  test("금액, 비율, 예약 수를 화면 표시 형식으로 반환한다", () => {
    expect(formatPercent(5.5)).toBe("5.5%");
    expect(formatManwon(1_234_500)).toBe("123만원");
    expect(formatBookingCount(1234)).toBe("1,234");
  })

  test("비율이 6이상이면 위험 색상을 반환한다", () => {
    expect(getRateTextColor(6)).toContain(
        "text-[#EF4444]"
    );
    expect(getRateTextColor(10)).toContain(
      "text-[#EF4444]"
    );
  });
    test("비율이 5 이상 6 미만이면 주의 색상을 반환한다", () => {
    expect(getRateTextColor(5)).toContain(
      "text-[#F59E0B]"
    );
    expect(getRateTextColor(5.99)).toContain(
      "text-[#F59E0B]"
    );
  });

  test("비율이 5 미만이면 기본 색상을 반환한다", () => {
    expect(getRateTextColor(4.99)).toContain(
      "text-[#667085]"
    );
    expect(getRateTextColor(0)).toContain(
      "text-[#667085]"
    );
  });


});
