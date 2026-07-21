import {
  formatMultiplier,
  formatPeople,
  formatPercent,
  getCountryEvaluation,
  getLectureConversionDateRange,
  lectureConversionPeriodLabels,
  lectureConversionPeriods,
} from "@/features/statisticadmin/course-reservation-conversion/utils";

describe("강의 → 예약 전환 유틸 테스트", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("기간 옵션과 라벨을 제공한다", () => {
    expect(lectureConversionPeriods).toEqual([
      "today",
      "thisWeek",
      "thisMonth",
      "thisYear",
    ]);
    expect(lectureConversionPeriodLabels.today).toBe("오늘");
    expect(lectureConversionPeriodLabels.thisYear).toBe("올해");
  });

  test("오늘, 이번 달, 올해의 조회 범위를 한국 시간 기준으로 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-22T09:00:00+09:00"));

    expect(getLectureConversionDateRange("today")).toEqual({
      from: "2026-07-22",
      to: "2026-07-22",
    });
    expect(getLectureConversionDateRange("thisMonth")).toEqual({
      from: "2026-07-01",
      to: "2026-07-22",
    });
    expect(getLectureConversionDateRange("thisYear")).toEqual({
      from: "2026-01-01",
      to: "2026-07-22",
    });
  });

  test("이번 주는 월요일부터 오늘까지 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-22T09:00:00+09:00"));

    expect(getLectureConversionDateRange("thisWeek")).toEqual({
      from: "2026-07-20",
      to: "2026-07-22",
    });
  });

  test("일요일에는 직전 월요일을 이번 주 시작일로 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-26T09:00:00+09:00"));

    expect(getLectureConversionDateRange("thisWeek")).toEqual({
      from: "2026-07-20",
      to: "2026-07-26",
    });
  });

  test("나라별 평가의 경계값을 정확히 분류한다", () => {
    expect(getCountryEvaluation(20.1)).toBe("우수");
    expect(getCountryEvaluation(20)).toBe("보통");
    expect(getCountryEvaluation(10.1)).toBe("보통");
    expect(getCountryEvaluation(10)).toBe("저조");
    expect(getCountryEvaluation(0)).toBe("저조");
  });

  test("인원, 퍼센트, 배수를 화면 표시 형식으로 변환한다", () => {
    expect(formatPeople(1234)).toBe("1,234명");
    expect(formatPercent(25.5)).toBe("25.5%");
    expect(formatMultiplier(2.4)).toBe("2.4×");
  });
});
