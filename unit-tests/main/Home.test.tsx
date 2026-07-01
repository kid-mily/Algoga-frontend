import { render, screen } from "@testing-library/react";
import Home from "@/app/(user)/page";

jest.mock("next/dynamic", () => {
    return jest.fn(() => {
        function DynamicMock() {
        return <div data-testid="dynamic-section" />;
        }

        return DynamicMock;
    });
    });

jest.mock("@/features/main/banner/components/Banner", () => {
    return function BannerMock() {
        return <div data-testid="banner" />;
    };
});

jest.mock("@/app/(user)/main/MapSection", () => {
    return function MapSectionMock() {
        return <div data-testid="map-section" />;
    };
});

jest.mock("@/features/main/calendar/components/ScheduleCalendar", () => {
    return function ScheduleCalendarMock() {
        return <div data-testid="schedule-calendar" />;
    };
});

jest.mock("@/features/main/notice/components/NoticeSection", () => {
    return function NoticeSectionMock() {
        return <div data-testid="notice-section" />;
    };
});

describe("Home page component", () => {
    test("홈 페이지 주요 섹션이 렌더링된다", async () => {
        render(await Home());

        expect(screen.getByTestId("map-section")).toBeInTheDocument();
        expect(screen.getByTestId("banner")).toBeInTheDocument();
        expect(screen.getByTestId("schedule-calendar")).toBeInTheDocument();
        expect(screen.getByTestId("notice-section")).toBeInTheDocument();
        expect(screen.getAllByTestId("dynamic-section")).toHaveLength(2);
    });
});