import {
  formatManwon,
  formatPercent,
  formatWon,
  getCohortCellClassName,
  getRepurchaseLtvDateRange,
  repurchaseLtvPeriodLabels,
  repurchaseLtvPeriods,
} from "@/features/statisticadmin/repurchase-ltv/utils";

describe("재구매·LTV 유틸 테스트", () => {
  afterEach(() => jest.useRealTimers());

  test("기간 옵션과 라벨을 제공한다", () => {
    expect(repurchaseLtvPeriods).toEqual(["TODAY", "THIS_WEEK", "THIS_MONTH", "THIS_YEAR"]);
    expect(repurchaseLtvPeriodLabels.TODAY).toBe("오늘");
    expect(repurchaseLtvPeriodLabels.THIS_YEAR).toBe("올해");
  });

  test("오늘, 이번 달, 올해의 조회 기간을 한국 시간 기준으로 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-22T09:00:00+09:00"));

    expect(getRepurchaseLtvDateRange("TODAY")).toEqual({ from: "2026-07-22", to: "2026-07-22" });
    expect(getRepurchaseLtvDateRange("THIS_MONTH")).toEqual({ from: "2026-07-01", to: "2026-07-22" });
    expect(getRepurchaseLtvDateRange("THIS_YEAR")).toEqual({ from: "2026-01-01", to: "2026-07-22" });
  });

  test("이번 주는 월요일부터 오늘까지 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-22T09:00:00+09:00"));
    expect(getRepurchaseLtvDateRange("THIS_WEEK")).toEqual({ from: "2026-07-20", to: "2026-07-22" });
  });

  test("일요일에는 직전 월요일을 이번 주 시작일로 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-26T09:00:00+09:00"));
    expect(getRepurchaseLtvDateRange("THIS_WEEK")).toEqual({ from: "2026-07-20", to: "2026-07-26" });
  });

  test("퍼센트와 금액을 화면 표시 형식으로 변환한다", () => {
    expect(formatPercent(25.5)).toBe("25.5%");
    expect(formatWon(1_234_500)).toBe("1,234,500원");
    expect(formatManwon(1_234_500)).toBe("123만원");
  });

  test("코호트 값의 경계에 맞는 히트맵 색상을 반환한다", () => {
    expect(getCohortCellClassName(null)).toContain("bg-[#F2F4F7]");
    expect(getCohortCellClassName(undefined)).toContain("bg-[#F2F4F7]");
    expect(getCohortCellClassName(80)).toContain("bg-[#1BA88F]");
    expect(getCohortCellClassName(79.9)).toContain("bg-[#32B89F]");
    expect(getCohortCellClassName(40)).toContain("bg-[#32B89F]");
    expect(getCohortCellClassName(39.9)).toContain("bg-[#67CDBA]");
    expect(getCohortCellClassName(25)).toContain("bg-[#67CDBA]");
    expect(getCohortCellClassName(24.9)).toContain("bg-[#B9E4DD]");
  });
});
