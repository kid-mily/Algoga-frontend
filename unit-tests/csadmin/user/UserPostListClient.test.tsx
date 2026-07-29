/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserPostListClient from "@/features/csadmin/user/components/UserPostListClient";
import { useUserPostList } from "@/features/csadmin/user/hooks/useUserPostList";

jest.mock("@/features/csadmin/user/hooks/useUserPostList", () => ({
  useUserPostList: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <img src={props.src} alt={props.alt} />
  ),
}));

const post = {
  postId: 12,
  displayId: "P012",
  title: "도쿄 여행 후기",
  content: "도쿄 여행 게시글 내용입니다.",
  createdAt: "2026.07.12",
  viewCount: 120,
  commentCount: 4,
};

const createHookValue = (override = {}) => ({
  posts: [post],
  selectedPost: null,
  deleteTarget: null,
  isLoading: false,
  isProcessing: false,
  error: "",
  currentPage: 1,
  totalPages: 2,
  totalCount: 12,
  setCurrentPage: jest.fn(),
  setSelectedPost: jest.fn(),
  setDeleteTarget: jest.fn(),
  openPostDetail: jest.fn(),
  confirmDelete: jest.fn(),
  ...override,
});

describe("UserPostListClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("회원 게시글 목록과 탭을 렌더링한다", () => {
    (useUserPostList as jest.Mock).mockReturnValue(createHookValue());

    render(<UserPostListClient userId={7} />);

    expect(screen.getByRole("link", { name: "게시글 목록" })).toHaveAttribute(
      "href",
      "/csadmin/user/7/post"
    );
    expect(screen.getByText("P012")).toBeVisible();
    expect(screen.getByText("도쿄 여행 후기")).toBeVisible();
    expect(screen.getByText("120")).toBeVisible();
    expect(screen.getByText("4")).toBeVisible();
  });

  test("상세 보기와 삭제 버튼 클릭 시 hook 함수를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useUserPostList as jest.Mock).mockReturnValue(hookValue);

    render(<UserPostListClient userId={7} />);

    await user.click(screen.getByLabelText("게시글 상세 보기: P012"));
    await user.click(screen.getByLabelText("게시글 삭제: P012"));

    expect(hookValue.openPostDetail).toHaveBeenCalledWith(12);
    expect(hookValue.setDeleteTarget).toHaveBeenCalledWith(post);
  });

  test("삭제 확인 모달에서 확인하면 confirmDelete를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({ deleteTarget: post });
    (useUserPostList as jest.Mock).mockReturnValue(hookValue);

    render(<UserPostListClient userId={7} />);

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(hookValue.confirmDelete).toHaveBeenCalled();
  });

  test("선택된 게시글이 있으면 상세 모달을 보여준다", () => {
    (useUserPostList as jest.Mock).mockReturnValue(
      createHookValue({ selectedPost: post })
    );

    render(<UserPostListClient userId={7} />);

    expect(screen.getByRole("dialog", { name: "게시글 상세" })).toBeVisible();
    expect(screen.getByText("도쿄 여행 게시글 내용입니다.")).toBeVisible();
  });
});
