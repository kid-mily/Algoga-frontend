import { render, screen } from "@testing-library/react";
import NoticeSection from "@/features/main/notice/components/NoticeSection";
import { getMainNotices } from "@/features/services/notice.service";

jest.mock("@/features/services/notice.service", () => ({
    getMainNotices: jest.fn(),
}));

jest.mock("@/features/main/notice/components/NoticeList", () => {
    return function NoticeListMock({
        notices,
    }: {
        notices: { title: string }[];
    }) {
        return (
        <ul data-testid="notice-list">
            {notices.map((notice) => (
            <li key={notice.title}>{notice.title}</li>
            ))}
        </ul>
        );
    };
});

describe("NoticeSection", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("공지 목록을 조회해서 NoticeList에 전달한다", async () => {
        (getMainNotices as jest.Mock).mockResolvedValueOnce([
        {
            noticeId: 1,
            tag: "NOTICE",
            title: "서비스 점검 안내",
            date: "2026-06-30",
            time: "10:00",
        },
        ]);

        render(await NoticeSection());

        expect(getMainNotices).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("notice-list")).toBeInTheDocument();
        expect(screen.getByText("서비스 점검 안내")).toBeInTheDocument();
    });

    test("공지 조회가 실패해도 빈 목록으로 렌더링한다", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        (getMainNotices as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

        render(await NoticeSection());

        expect(screen.getByTestId("notice-list")).toBeInTheDocument();
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();

        (console.error as jest.Mock).mockRestore();
    });

    test("더보기 링크가 공지 페이지로 연결된다", async () => {
        (getMainNotices as jest.Mock).mockResolvedValueOnce([]);

        render(await NoticeSection());

        expect(screen.getByRole("link")).toHaveAttribute("href", "/notice");
    });
});