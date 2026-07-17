import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportManageClient from "@/features/csadmin/report/components/ReportManageClient";
import { getAdminReports } from "@/features/services/adminReport.service";

jest.mock("@/features/services/adminReport.service", () => ({
  getAdminReports: jest.fn(),
}));

const pushMock = jest.fn();
let searchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => searchParams,
}));

const reports = [
  {
    reportId: 10,
    reporterId: 1,
    reporterName: "신고자",
    reportedUserId: 2,
    reportedUserName: "피신고자",
    targetType: "POST",
    targetId: 30,
    postTitle: "문제 게시글",
    reason: "스팸/광고",
    content: "광고 내용",
    status: "RECEIVED",
    createdAt: "2026.07.15 10:00",
    processedAt: null,
  },
];

const reportPage = {
  reports,
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 2,
  first: true,
  last: false,
};

describe("ReportManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    searchParams = new URLSearchParams();
    (getAdminReports as jest.Mock).mockResolvedValue(reportPage);
  });

  test("신고 내역 목록과 처리 대기 건수를 렌더링한다", async () => {
    render(<ReportManageClient initialPage={1} />);

    expect((await screen.findAllByText("신고 내역 관리"))[0]).toBeVisible();
    expect(await screen.findByText("#10")).toBeVisible();
    expect(screen.getByText("총 1건 | 현재 페이지 처리 대기 1건")).toBeVisible();
    expect(screen.getAllByText("신고자")[0]).toBeVisible();
    expect(screen.getAllByText("피신고자")[0]).toBeVisible();
    expect(screen.getByText("스팸/광고")).toBeVisible();
    expect(screen.getByRole("link", { name: "신고 #10 상세 보기" })).toHaveAttribute(
      "href",
      "/csadmin/reports/10"
    );
  });

  test("검색과 필터 변경 시 URL 쿼리를 갱신한다", async () => {
    const user = userEvent.setup();

    render(<ReportManageClient initialPage={1} />);

    await screen.findByText("#10");
    await user.type(
      screen.getByPlaceholderText("신고자/피신고자 이름, 닉네임 검색"),
      "신고자"
    );
    await user.click(screen.getByRole("button", { name: "검색" }));
    await user.selectOptions(screen.getByLabelText("신고 처리 상태 필터"), "COMPLETED");
    await user.selectOptions(screen.getByLabelText("신고 유형 필터"), "COMMENT");

    expect(pushMock).toHaveBeenCalledWith(
      expect.stringContaining("keyword=%EC%8B%A0%EA%B3%A0%EC%9E%90")
    );
    expect(pushMock).toHaveBeenCalledWith(
      expect.stringContaining("status=COMPLETED")
    );
    expect(pushMock).toHaveBeenCalledWith(
      expect.stringContaining("targetType=COMMENT")
    );
  });

  test("다음 페이지 버튼을 누르면 page 쿼리를 갱신한다", async () => {
    const user = userEvent.setup();

    render(<ReportManageClient initialPage={1} />);

    await screen.findByText("#10");
    await user.click(screen.getByRole("button", { name: "다음" }));

    expect(pushMock).toHaveBeenCalledWith("/csadmin/reports?page=2");
  });

  test("서비스 요청 실패 시 에러 문구를 보여준다", async () => {
    (getAdminReports as jest.Mock).mockRejectedValue(new Error("신고 조회 실패"));

    render(<ReportManageClient initialPage={1} />);

    await waitFor(() => {
      expect(screen.getByText("신고 조회 실패")).toBeVisible();
    });
  });
});
