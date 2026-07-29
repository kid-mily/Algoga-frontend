import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminQnaManageClient from "@/features/contentmanage/qna/components/AdminQnaManageClient";
import { useAdminQnaList } from "@/features/contentmanage/qna/hooks/useAdminQnaList";

jest.mock("@/features/contentmanage/qna/hooks/useAdminQnaList", () => ({
  useAdminQnaList: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const baseHookValue = {
  currentQnas: [
    {
      id: 3,
      courseId: 12,
      userId: 99,
      lecture: "오사카 여행 준비",
      title: "환전은 어떻게 하나요?",
      content: "엔화 환전 정보를 알고 싶습니다.",
      writer: "여행러버",
      createdAt: "2026-07-14",
      isAnswered: false,
      comments: [],
    },
    {
      id: 4,
      courseId: 13,
      userId: 100,
      lecture: "파리 여행 준비",
      title: "공항 이동 질문",
      content: "공항에서 시내 이동은 어떻게 하나요?",
      writer: "파리러버",
      createdAt: "2026-07-13",
      isAnswered: true,
      comments: [
        {
          id: 1,
          writer: "관리자",
          content: "공항철도를 추천합니다.",
          createdAt: "2026-07-13",
        },
      ],
    },
  ],
  filteredCount: 2,
  isLoading: false,
  error: "",
  searchKeyword: "",
  statusFilter: "all",
  currentPage: 1,
  totalPages: 1,
  setCurrentPage: jest.fn(),
  setSearchKeyword: jest.fn(),
  setStatusFilter: jest.fn(),
};

describe("AdminQnaManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAdminQnaList as jest.Mock).mockReturnValue(baseHookValue);
  });

  test("Q&A 목록과 답변 상태를 렌더링한다", () => {
    render(<AdminQnaManageClient />);

    expect(screen.getByText("Q&A 관리")).toBeVisible();
    expect(screen.getByText("오사카 여행 준비")).toBeVisible();
    expect(screen.getByText("환전은 어떻게 하나요?")).toBeVisible();
    expect(screen.getByText("여행러버")).toBeVisible();
    expect(screen.getAllByText("답변 대기")).toHaveLength(2);
    expect(screen.getAllByText("답변 완료")).toHaveLength(2);
    expect(screen.getByText("총 2개의 문의")).toBeVisible();
  });

  test("검색어와 상태 필터를 변경하면 hook setter를 호출한다", async () => {
    const user = userEvent.setup();

    render(<AdminQnaManageClient />);

    await user.type(screen.getByPlaceholderText("제목 또는 질문 내용 검색..."), "환전");
    await user.selectOptions(screen.getByRole("combobox"), "waiting");

    expect(baseHookValue.setSearchKeyword).toHaveBeenCalled();
    expect(baseHookValue.setStatusFilter).toHaveBeenCalledWith("waiting");
  });

  test("답변 버튼을 클릭하면 답변 작성 페이지로 이동한다", async () => {
    const user = userEvent.setup();

    render(<AdminQnaManageClient />);

    await user.click(screen.getAllByRole("button", { name: "답변" })[0]);

    expect(pushMock).toHaveBeenCalledWith("/contentadmin/qna/3?courseId=12");
  });
});
