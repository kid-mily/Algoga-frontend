import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CsInquiryDetailClient from "@/features/csadmin/inquiry/components/CsInquiryDetailClient";
import {
  answerAdminInquiry,
  getAdminInquiryById,
} from "@/features/services/adminInquiry.service";

jest.mock("@/features/services/adminInquiry.service", () => ({
  answerAdminInquiry: jest.fn(),
  getAdminInquiryById: jest.fn(),
}));

const inquiry = {
  id: "INQ001",
  inquiryId: 1,
  userId: 10,
  writer: "회원 #10",
  category: "REFUND",
  type: "환불",
  title: "환불 처리는 언제 되나요?",
  content: "환불 요청 후 처리 일정을 알고 싶습니다.",
  answer: null,
  date: "2026.07.15 10:30",
  answeredAt: null,
  statusCode: "PENDING",
  status: "미처리",
};

describe("CsInquiryDetailClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAdminInquiryById as jest.Mock).mockResolvedValue(inquiry);
    (answerAdminInquiry as jest.Mock).mockResolvedValue(undefined);
  });

  test("고객 문의 상세와 답변 입력 폼을 렌더링한다", async () => {
    render(<CsInquiryDetailClient inquiryId={1} />);

    expect(screen.getByText("고객 문의를 불러오는 중입니다...")).toBeVisible();

    expect(await screen.findByText("환불 처리는 언제 되나요?")).toBeVisible();
    expect(screen.getByText("환불 요청 후 처리 일정을 알고 싶습니다.")).toBeVisible();
    expect(screen.getByLabelText(/관리자 답변/)).toBeEnabled();
  });

  test("답변이 비어 있으면 등록 버튼이 비활성화된다", async () => {
    render(<CsInquiryDetailClient inquiryId={1} />);

    await screen.findByText("환불 처리는 언제 되나요?");

    expect(screen.getByRole("button", { name: "답변 등록" })).toBeDisabled();
  });

  test("답변 등록 확인 후 완료 모달을 보여준다", async () => {
    const user = userEvent.setup();

    render(<CsInquiryDetailClient inquiryId={1} />);

    const textarea = await screen.findByLabelText(/관리자 답변/);
    await user.type(textarea, "환불은 영업일 기준 3일 안에 처리됩니다.");
    await user.click(screen.getByRole("button", { name: "답변 등록" }));

    expect(screen.getByText("답변 전송")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "전송" }));

    await waitFor(() => {
      expect(answerAdminInquiry).toHaveBeenCalledWith(
        1,
        "환불은 영업일 기준 3일 안에 처리됩니다."
      );
    });
    expect(screen.getByText("문의 답변이 등록되었습니다.")).toBeVisible();
  });
});
