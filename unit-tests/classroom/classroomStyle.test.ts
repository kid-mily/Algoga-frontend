import { getContinentStyle } from "@/features/classroom/components/continentStyle";
import { getCountryTicketStyle } from "@/features/classroom/components/countryTicketStyle";

describe("classroom style utils", () => {
    test("getContinentStyle은 등록된 대륙 스타일을 반환한다", () => {
        expect(getContinentStyle("ASIA")).toMatchObject({
        label: "Asia",
        code: "AS",
        accent: "bg-[#439A97]",
        });
    });

    test("getContinentStyle은 소문자 코드도 처리한다", () => {
        expect(getContinentStyle("europe")).toMatchObject({
        label: "Europe",
        code: "EU",
        accent: "bg-[#4F7FD9]",
        });
    });

    test("getContinentStyle은 알 수 없는 대륙이면 fallback 스타일을 반환한다", () => {
        expect(getContinentStyle("mars")).toMatchObject({
        label: "mars",
        code: "MA",
        accent: "bg-[#94A3B8]",
        soft: "bg-[#F8FAFC] text-[#64748B]",
        });
    });

    test("getCountryTicketStyle은 등록된 대륙의 티켓 스타일을 반환한다", () => {
        expect(getCountryTicketStyle("ASIA")).toEqual({
        accent: "bg-[#439A97]",
        soft: "bg-[#EEF8F7]",
        text: "text-[#357F7C]",
        });
    });

    test("getCountryTicketStyle은 알 수 없는 대륙이면 fallback 스타일을 반환한다", () => {
        expect(getCountryTicketStyle("UNKNOWN")).toEqual({
        accent: "bg-[#94A3B8]",
        soft: "bg-[#F8FAFC]",
        text: "text-[#64748B]",
        });
    });
});