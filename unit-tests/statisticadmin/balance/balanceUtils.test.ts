import {
  formatDisplayDate,
  formatWon,
  getBalanceDateRange,
  getDDayClassName,
  getDDayLabel,
} from "@/features/statisticadmin/balance/utils";

describe("잔금 관리 유틸 테스트", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T09:00:00+09:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("금액과 날짜 표시 형식을 변환한다", () => {
    expect(formatWon(84_500_000)).toBe("84,500,000원");
    expect(formatWon(0)).toBe("0원");
    expect(formatDisplayDate("2026-07-20")).toBe("2026.07.20");
    expect(formatDisplayDate("")).toBe("-");
  });

  test("기간 프리셋에 맞는 조회 기간을 만든다", () => {
    expect(getBalanceDateRange("today")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(getBalanceDateRange("thisWeek")).toEqual({
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(getBalanceDateRange("thisMonth")).toEqual({
      from: "2026-07-01",
      to: "2026-07-20",
    });

    expect(getBalanceDateRange("thisYear")).toEqual({
      from: "2026-01-01",
      to: "2026-07-20",
    });
  });

  test("D-day 라벨과 상태 색상을 반환한다", () => {
    expect(getDDayLabel(-3)).toBe("D-3");
    expect(getDDayLabel(0)).toBe("D-day");
    expect(getDDayLabel(10)).toBe("D+10");

    expect(getDDayClassName(-1)).toContain("text-[#EF4444]");
    expect(getDDayClassName(7)).toContain("text-[#F59E0B]");
    expect(getDDayClassName(8)).toContain("text-[#667085]");
  });
});
