import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewManageClient from "@/features/contentmanage/review/components/ReviewManageClient";
import { useReviewList } from "@/features/contentmanage/review/hooks/useReviewList";
import type { AdminReview } from "@/features/contentmanage/review/types";

jest.mock("@/features/contentmanage/review/hooks/useReviewList", () => ({
  useReviewList: jest.fn(),
}));

jest.mock("next/image", () => {
  return function ImageMock({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  };
});

const review: AdminReview = {
  id: 1,
  courseId: 10,
  level: "고급",
  packageName: "뉴욕 자유여행 가이드",
  rating: 3.8,
  user: "박여행",
  userId: "U003",
  content: "내용이 알찼습니다.",
  completedAt: "2026.07.01",
  reviewedAt: "2026.07.04",
  hidden: false,
};

const baseHookValue = {
  courses: [
    {
      courseId: 10,
      countryId: 1,
      title: "뉴욕 자유여행 가이드",
    },
  ],
  selectedCourseId: null,
  selectedScore: "전체",
  filteredReviews: [review],
  deleteTarget: null,
  deleteCompleteOpen: false,
  visibilityTarget: null,
  visibilityCompleteOpen: false,
  isLoading: false,
  isProcessing: false,
  error: "",
  setSelectedCourseId: jest.fn(),
  setSelectedScore: jest.fn(),
  setDeleteTarget: jest.fn(),
  setDeleteCompleteOpen: jest.fn(),
  setVisibilityTarget: jest.fn(),
  setVisibilityCompleteOpen: jest.fn(),
  deleteReview: jest.fn(),
  updateVisibility: jest.fn(),
};

describe("ReviewManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useReviewList as jest.Mock).mockReturnValue(baseHookValue);
  });

  test("후기 관리 화면을 렌더링한다", () => {
    render(<ReviewManageClient />);

    expect(screen.getByText("후기 관리")).toBeVisible();
    expect(screen.getByText("강의 수료 학생의 후기를 조회하고 관리합니다")).toBeVisible();
    expect(screen.getByText("총 1개 후기")).toBeVisible();
    expect(screen.getAllByText("뉴욕 자유여행 가이드")).toHaveLength(2);
  });

  test("에러 메시지가 있으면 alert로 표시한다", () => {
    (useReviewList as jest.Mock).mockReturnValue({
      ...baseHookValue,
      error: "후기 목록을 불러오지 못했습니다.",
    });

    render(<ReviewManageClient />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "후기 목록을 불러오지 못했습니다."
    );
  });

  test("강의와 평점 필터 변경 콜백을 호출한다", async () => {
    const user = userEvent.setup();

    render(<ReviewManageClient />);

    await user.selectOptions(screen.getByLabelText("강의 선택"), "10");
    await user.click(screen.getByRole("button", { name: "5점" }));

    expect(baseHookValue.setSelectedCourseId).toHaveBeenCalledWith(10);
    expect(baseHookValue.setSelectedScore).toHaveBeenCalledWith("5점");
  });

  test("후기 숨김과 삭제 클릭을 훅 상태 변경으로 연결한다", async () => {
    const user = userEvent.setup();

    render(<ReviewManageClient />);

    await user.click(
      screen.getByRole("button", {
        name: "뉴욕 자유여행 가이드 박여행 후기 숨김 상태 변경",
      })
    );
    await user.click(
      screen.getByRole("button", {
        name: "뉴욕 자유여행 가이드 박여행 후기 삭제",
      })
    );

    expect(baseHookValue.setVisibilityTarget).toHaveBeenCalledWith(review);
    expect(baseHookValue.setDeleteTarget).toHaveBeenCalledWith(review);
  });
});
