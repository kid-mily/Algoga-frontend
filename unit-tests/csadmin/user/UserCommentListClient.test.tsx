/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserCommentListClient from "@/features/csadmin/user/components/UserCommentListClient";
import { useUserCommentList } from "@/features/csadmin/user/hooks/useUserCommentList";

jest.mock("@/features/csadmin/user/hooks/useUserCommentList", () => ({
  useUserCommentList: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <img src={props.src} alt={props.alt} />
  ),
}));

const comment = {
  commentId: 21,
  displayId: "C021",
  postId: 12,
  postTitle: "도쿄 여행 후기",
  content: "좋은 정보 감사합니다.",
  createdAt: "2026.07.13",
};

const createHookValue = (override = {}) => ({
  comments: [comment],
  selectedComment: null,
  deleteTarget: null,
  isLoading: false,
  isProcessing: false,
  error: "",
  currentPage: 1,
  totalPages: 2,
  totalCount: 5,
  setCurrentPage: jest.fn(),
  setSelectedComment: jest.fn(),
  setDeleteTarget: jest.fn(),
  openCommentDetail: jest.fn(),
  confirmDelete: jest.fn(),
  ...override,
});

describe("UserCommentListClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("회원 댓글 목록과 탭을 렌더링한다", () => {
    (useUserCommentList as jest.Mock).mockReturnValue(createHookValue());

    render(<UserCommentListClient userId={7} />);

    expect(screen.getByRole("link", { name: "댓글 목록" })).toHaveAttribute(
      "href",
      "/csadmin/user/7/comment"
    );
    expect(screen.getByText("C021")).toBeVisible();
    expect(screen.getByText("도쿄 여행 후기")).toBeVisible();
    expect(screen.getByText("좋은 정보 감사합니다.")).toBeVisible();
  });

  test("상세 보기와 삭제 버튼 클릭 시 hook 함수를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useUserCommentList as jest.Mock).mockReturnValue(hookValue);

    render(<UserCommentListClient userId={7} />);

    await user.click(screen.getByLabelText("댓글 상세 보기: C021"));
    await user.click(screen.getByLabelText("댓글 삭제: C021"));

    expect(hookValue.openCommentDetail).toHaveBeenCalledWith(21);
    expect(hookValue.setDeleteTarget).toHaveBeenCalledWith(comment);
  });

  test("삭제 확인 모달에서 확인하면 confirmDelete를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({ deleteTarget: comment });
    (useUserCommentList as jest.Mock).mockReturnValue(hookValue);

    render(<UserCommentListClient userId={7} />);

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(hookValue.confirmDelete).toHaveBeenCalled();
  });

  test("선택된 댓글이 있으면 상세 모달을 보여준다", () => {
    (useUserCommentList as jest.Mock).mockReturnValue(
      createHookValue({ selectedComment: comment })
    );

    render(<UserCommentListClient userId={7} />);

    expect(screen.getByRole("dialog", { name: "댓글 상세" })).toBeVisible();
    expect(screen.getAllByText("좋은 정보 감사합니다.")[0]).toBeVisible();
  });
});
