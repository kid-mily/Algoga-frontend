import { render, screen } from "@testing-library/react";
import ClassRoomMainPage from "@/app/(user)/classroom/page";
import { getContinents } from "@/features/services/ContinentSelection.service";

jest.mock("@/features/services/ContinentSelection.service", () => ({
    getContinents: jest.fn(),
}));

jest.mock("@/features/classroom/components/ContinentSelectForm", () => {
    return function ContinentSelectFormMock({
        continents,
    }: {
        continents: { continentName: string }[];
    }) {
        return (
        <div data-testid="continent-select-form">
            {continents.map((continent) => continent.continentName).join(",")}
        </div>
        );
    };
});

jest.mock("@/features/main/learningmethod/LearningMethod", () => {
    return function LearningMethodMock() {
        return <div data-testid="learning-method" />;
    };
});

describe("ClassRoomMainPage component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("대륙 데이터를 조회해서 ContinentSelectForm에 전달한다", async () => {
        (getContinents as jest.Mock).mockResolvedValueOnce([
        {
            continentCode: "ASIA",
            continentName: "아시아",
            countryCount: 3,
            courseCount: 10,
        },
        {
            continentCode: "EUROPE",
            continentName: "유럽",
            countryCount: 2,
            courseCount: 5,
        },
        ]);

        render(await ClassRoomMainPage());

        expect(getContinents).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("continent-select-form")).toHaveTextContent(
        "아시아,유럽"
        );
        expect(screen.getByTestId("learning-method")).toBeInTheDocument();
    });

    test("대륙 데이터가 비어 있어도 페이지가 렌더링된다", async () => {
        (getContinents as jest.Mock).mockResolvedValueOnce([]);

        render(await ClassRoomMainPage());

        expect(screen.getByTestId("continent-select-form")).toBeInTheDocument();
        expect(screen.getByTestId("learning-method")).toBeInTheDocument();
    });
});