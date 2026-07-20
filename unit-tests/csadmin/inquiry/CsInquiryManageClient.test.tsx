import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CsInquiryManageClient from "@/features/csadmin/inquiry/components/CsInquiryManageClient";
import { useCsInquiryList } from "@/features/csadmin/inquiry/hooks/useCsInquiryList";

const pushMock = jest.fn();

jest.mock("@/features/csadmin/inquiry/hooks/useCsInquiryList", () => ({
  useCsInquiryList: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const hookValue = {
  searchKeyword: "",
  selectedCategory: "ALL",
  selectedStatus: "ALL",
  filteredInquiries: [
    {
      id: "INQ001",
      inquiryId: 1,
      userId: 10,
      userName: "김진도",
      userNickname: "jindo",
      writer: "jindo",
      category: "REFUND",
      type: "환불",
      title: "환불 처리는 언제 되나요?",
      content: "환불 문의입니다.",
      answer: null,
      date: "2026.07.15 10:30",
      answeredAt: null,
      statusCode: "PENDING",
      status: "미처리",
    },
    {
      id: "INQ002",
      inquiryId: 2,
      userId: 11,
      userName: "박여행",
      userNickname: null,
      writer: "박여행",
      category: "COURSE",
      type: "강의",
      title: "강의 재생이 안 됩니다",
      content: "강의 문의입니다.",
      answer: "확인했습니다.",
      date: "2026.07.14 12:00",
      answeredAt: "2026.07.14 13:00",
      statusCode: "ANSWERED",
      status: "답변 완료",
    },
  ],
  totalCount: 2,
  pendingCount: 1,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: "",
  setSearchKeyword: jest.fn(),
  setSelectedCategory: jest.fn(),
  setSelectedStatus: jest.fn(),
  setCurrentPage: jest.fn(),
};

describe("CsInquiryManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCsInquiryList as jest.Mock).mockReturnValue(hookValue);
  });

  test("고객 문의 목록과 처리 상태를 렌더링한다", () => {
    render(<CsInquiryManageClient initialInquiries={[]} />);

    expect(screen.getByText("고객 문의 관리")).toBeVisible();
    expect(screen.getByText("환불 처리는 언제 되나요?")).toBeVisible();
    expect(screen.getByText("강의 재생이 안 됩니다")).toBeVisible();
    expect(screen.getByText("총 2건")).toBeVisible();
    expect(screen.getByText("1건")).toBeVisible();
    expect(screen.getAllByText("미처리")).toHaveLength(2);
    expect(screen.getAllByText("답변 완료")).toHaveLength(2);
  });

  test("문의 행 전체를 클릭하면 상세 페이지로 이동한다", async () => {
    const user = userEvent.setup();

    render(<CsInquiryManageClient initialInquiries={[]} />);

    await user.click(
      screen.getByRole("link", { name: "환불 처리는 언제 되나요? 상세 보기" })
    );

    expect(pushMock).toHaveBeenCalledWith("/csadmin/inquiry/1");
  });

  test("검색어와 필터를 변경하면 hook setter를 호출한다", async () => {
    const user = userEvent.setup();

    render(<CsInquiryManageClient initialInquiries={[]} />);

    await user.type(screen.getByPlaceholderText("제목 또는 작성자 검색..."), "환불");
    await user.selectOptions(screen.getByLabelText("문의 유형"), "REFUND");
    await user.selectOptions(screen.getByLabelText("처리 상태"), "PENDING");

    expect(hookValue.setSearchKeyword).toHaveBeenCalled();
    expect(hookValue.setSelectedCategory).toHaveBeenCalledWith("REFUND");
    expect(hookValue.setSelectedStatus).toHaveBeenCalledWith("PENDING");
  });
});
