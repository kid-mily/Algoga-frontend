import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContinentTicketCard from "@/features/classroom/components/ContinentTicketCard";
import CountryCard from "@/features/classroom/components/CountryCard";
import CountrySearchClient from "@/features/classroom/components/CountrySearchClient";

const ticketStyle = {
    accent: "bg-test",
    soft: "bg-soft",
    text: "text-test",
};

describe("Classroom components", () => {
    test("ContinentTicketCard는 대륙 이름과 국가 수, 링크를 렌더링한다", () => {
        render(
        <ContinentTicketCard
            continent={{
            continentCode: "ASIA",
            continentName: "아시아",
            countryCount: 4,
            courseCount: 12,
            }}
        />
        );

        const link = screen.getByRole("link", { name: /아시아/i });

        expect(screen.getByText("아시아")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/classroom/asia");
    });

    test("CountryCard는 국가 이름과 강의 수, 링크를 렌더링한다", () => {
        render(
        <CountryCard
            continentCode="ASIA"
            ticketStyle={ticketStyle}
            country={{
            countryId: 1,
            countryCode: "JP",
            countryName: "일본",
            continentCode: "ASIA",
            courseCount: 7,
            }}
        />
        );

        const link = screen.getByRole("link", { name: /일본/i });

        expect(screen.getByText("일본")).toBeInTheDocument();
        expect(screen.getByText(/7/)).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/classroom/asia/1");
    });

    test("CountrySearchClient는 검색 버튼 클릭 후 일치하는 국가만 보여준다", async () => {
        const user = userEvent.setup();

        render(
        <CountrySearchClient
            continentCode="ASIA"
            continentName="?꾩떆??"
            ticketStyle={ticketStyle}
            countries={[
            {
                countryId: 1,
                countryCode: "JP",
                countryName: "일본",
                continentCode: "ASIA",
                courseCount: 7,
            },
            {
                countryId: 2,
                countryCode: "KR",
                countryName: "한국",
                continentCode: "ASIA",
                courseCount: 5,
            },
            ]}
        />
        );

        await user.type(screen.getByRole("textbox"), "일본");
        await user.click(screen.getByRole("button"));

        expect(screen.getByText("일본")).toBeInTheDocument();
        expect(screen.queryByText("한국")).not.toBeInTheDocument();
    });

    test("CountrySearchClient는 에러 메시지가 있으면 에러 상태를 보여준다", () => {
        render(
        <CountrySearchClient
            continentCode="ASIA"
            continentName="?꾩떆??"
            ticketStyle={ticketStyle}
            countries={[]}
            errorMessage="국가 데이터를 불러오지 못했습니다."
        />
        );

        expect(
        screen.getByText("국가 데이터를 불러오지 못했습니다.")
        ).toBeInTheDocument();
    });
});
