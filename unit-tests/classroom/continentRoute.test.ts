import { createClassroomCountryHref, createLectureHref, toContinentApiCode, toContinentPathCode } from "@/features/classroom/utils/continentRoute";

describe("continentRoute utils", () => {
    test("toContinentPathCode는 공백을 제거하고 소문자로 변환한다", () => {
        expect(toContinentPathCode(" ASIA ")).toBe("asia");
        expect(toContinentPathCode("North_America")).toBe("north_america");
    });

    test("toContinentApiCode는 공백을 제거하고 대문자로 변환한다", () => {
        expect(toContinentApiCode(" asia ")).toBe("ASIA");
        expect(toContinentApiCode("europe")).toBe("EUROPE");
    });

    test("createClassroomCountryHref는 국가 선택 페이지 경로를 만든다", () => {
        expect(createClassroomCountryHref(" ASIA ", 12)).toBe(
        "/classroom/asia/12"
        );
    });

    test("createLectureHref는 강의 상세 페이지 경로를 만든다", () => {
        expect(createLectureHref("EUROPE", 3, 99)).toBe(
        "/classroom/europe/3/lecture/99"
        );
    });
});