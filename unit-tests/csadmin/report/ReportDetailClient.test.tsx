import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReportDetailClient from "@/features/csadmin/report/components/ReportDetailClient";
import {
  completeAdminReport,
  deleteReportedTarget,
  getAdminReportById,
  rejectAdminReport,
} from "@/features/services/adminReport.service";

jest.mock("@/features/services/adminReport.service", () => ({
  completeAdminReport: jest.fn(),
  deleteReportedTarget: jest.fn(),
  getAdminReportById: jest.fn(),
  rejectAdminReport: jest.fn(),
}));

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

const report = {
  reportId: 10,
  reporterId: 1,
  reporterName: "신고자",
  reportedUserId: 2,
  reportedUserName: "피신고자",
  targetType: "POST",
  targetId: 30,
  postTitle: "문제 게시글",
  reason: "스팸/광고",
  content: "광고 내용입니다.",
  status: "RECEIVED",
  createdAt: "2026.07.15 10:00",
  processedAt: null,
};

const completedReport = {
  ...report,
  status: "COMPLETED",
};

describe("ReportDetailClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAdminReportById as jest.Mock).mockResolvedValue(report);
    (deleteReportedTarget as jest.Mock).mockResolvedValue(undefined);
    (rejectAdminReport as jest.Mock).mockResolvedValue(undefined);
    (completeAdminReport as jest.Mock).mockResolvedValue(undefined);
  });

  test("신고 상세 정보와 처리 버튼을 렌더링한다", async () => {
    render(<ReportDetailClient reportId={10} />);

    expect(screen.getByText("신고 상세 정보를 불러오는 중입니다...")).toBeVisible();

    expect(await screen.findByText("신고 내용")).toBeVisible();
    expect(screen.getByText("신고자 (#1)")).toBeVisible();
    expect(screen.getByText("피신고자 (#2)")).toBeVisible();
    expect(screen.getAllByText("게시글")[0]).toBeVisible();
    expect(screen.getByText("문제 게시글")).toBeVisible();
    expect(screen.getByText("광고 내용입니다.")).toBeVisible();
  });

  test("신고 처리완료 확인 시 처리 API를 호출하고 완료 모달을 보여준다", async () => {
    const user = userEvent.setup();
    (getAdminReportById as jest.Mock)
      .mockResolvedValueOnce(report)
      .mockResolvedValueOnce(completedReport);

    render(<ReportDetailClient reportId={10} />);

    await screen.findByText("신고 내용");
    await user.click(screen.getByRole("button", { name: "신고 처리완료" }));
    await user.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(completeAdminReport).toHaveBeenCalledWith(10);
    });
    expect(await screen.findByText("신고가 처리 완료되었습니다.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "확인" }));
    expect(refreshMock).toHaveBeenCalled();
  });

  test("신고 반려 확인 시 반려 API를 호출한다", async () => {
    const user = userEvent.setup();

    render(<ReportDetailClient reportId={10} />);

    await screen.findByText("신고 내용");
    await user.click(screen.getByRole("button", { name: "신고 반려" }));
    await user.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(rejectAdminReport).toHaveBeenCalledWith(10);
    });
  });

  test("대상 삭제 확인 시 신고 대상 삭제 API를 호출한다", async () => {
    const user = userEvent.setup();

    render(<ReportDetailClient reportId={10} />);

    await screen.findByText("신고 내용");
    await user.click(screen.getByRole("button", { name: "게시글 삭제" }));
    await user.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(deleteReportedTarget).toHaveBeenCalledWith("POST", 30);
    });
  });

  test("상세 조회 실패 시 에러 문구를 보여준다", async () => {
    (getAdminReportById as jest.Mock).mockRejectedValue(new Error("상세 조회 실패"));

    render(<ReportDetailClient reportId={10} />);

    expect(await screen.findByText("상세 조회 실패")).toBeVisible();
  });
});
