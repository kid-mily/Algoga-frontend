import { formatCalendarDate, getMonthStartDate } from "@/features/main/calendar/utils/calendar.utils";

describe("calendar utils", () => {
    test("formatCalendarDate는 월과 일을 두 자리로 포맷한다", () => {
        expect(formatCalendarDate(2026, 6, 3)).toBe("2026-06-03");
        expect(formatCalendarDate(2026, 12, 25)).toBe("2026-12-25");
    });

    test("getMonthStartDate는 해당 월의 1일 Date를 반환한다", () => {
        const result = getMonthStartDate(new Date(2026, 5, 30));

        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(5);
        expect(result.getDate()).toBe(1);
    });
});