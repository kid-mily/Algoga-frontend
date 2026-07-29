import {
  getCompletionStatusStyle,
  getInterestDateRange,
  interestPeriodLabels,
  interestPeriods,
} from "@/features/statisticadmin/country-course-interest/utils";

describe("나라/강의별 관심도 유틸 테스트", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("기간 옵션과 라벨을 제공한다", () => {
    expect(interestPeriods).toEqual(["today", "week", "month", "year"]);
    expect(interestPeriodLabels.today).toBe("오늘");
    expect(interestPeriodLabels.month).toBe("이번달");
  });

  test("기간별 조회 날짜 범위를 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T09:00:00+09:00"));

    expect(getInterestDateRange("today")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });
    expect(getInterestDateRange("week")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });
    expect(getInterestDateRange("month")).toEqual({
      from: "2026-07-01",
      to: "2026-07-20",
    });
    expect(getInterestDateRange("year")).toEqual({
      from: "2026-01-01",
      to: "2026-07-20",
    });
  });

  test("수료율 상태별 표시 정보를 반환한다", () => {
    expect(getCompletionStatusStyle("NORMAL")).toMatchObject({
      label: "",
      valueClassName: "text-[#2FAE9B]",
    });
    expect(getCompletionStatusStyle("WARNING")).toMatchObject({
      label: "주의",
      valueClassName: "text-[#F59E0B]",
    });
    expect(getCompletionStatusStyle("RISK")).toMatchObject({
      label: "점검필요",
      valueClassName: "text-[#EF4444]",
    });
  });
});
