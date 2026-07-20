import {
  formatNumber,
  formatPercent,
  formatSignupPathError,
  formatWon,
  getSignupPathDateRange,
  signupPathPeriodLabels,
  signupPathPeriods,
} from "@/features/statisticadmin/user/utils";

describe("유입경로별 전환 유틸 테스트", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("기간 옵션과 라벨을 제공한다", () => {
    expect(signupPathPeriods).toEqual([
      "all",
      "today",
      "thisWeek",
      "thisMonth",
      "thisYear",
    ]);
    expect(signupPathPeriodLabels.all).toBe("전체");
    expect(signupPathPeriodLabels.thisYear).toBe("올해");
  });

  test("기간별 조회 날짜 범위를 계산한다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T09:00:00+09:00"));

    expect(getSignupPathDateRange("all")).toEqual({
      from: "2000-01-01",
      to: "2026-07-20",
    });
    expect(getSignupPathDateRange("today")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });
    expect(getSignupPathDateRange("thisMonth")).toEqual({
      from: "2026-07-01",
      to: "2026-07-20",
    });
    expect(getSignupPathDateRange("thisYear")).toEqual({
      from: "2026-01-01",
      to: "2026-07-20",
    });
  });

  test("숫자, 퍼센트, 금액을 화면 표시 형식으로 변환한다", () => {
    expect(formatNumber(5460)).toBe("5,460");
    expect(formatPercent(12)).toBe("12.0%");
    expect(formatWon(726_000_000)).toBe("7.3억원");
    expect(formatWon(158_065)).toBe("15.8만원");
    expect(formatWon(900)).toBe("900원");
  });

  test("에러 메시지를 fallback과 함께 변환한다", () => {
    expect(formatSignupPathError(new Error("조회 실패"), "기본 오류")).toBe(
      "조회 실패"
    );
    expect(formatSignupPathError(null, "기본 오류")).toBe("기본 오류");
  });
});
