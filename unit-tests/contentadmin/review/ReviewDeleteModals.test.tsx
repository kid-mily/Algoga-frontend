import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewDeleteModals from "@/features/contentmanage/review/components/ReviewDeleteModals";
import type { AdminReview } from "@/features/contentmanage/review/types";

const review: AdminReview = {
  id: 1,
  courseId: 10,
  level: "초급",
  packageName: "파리 완전 정복 2024",
  rating: 5,
  user: "이여행",
  userId: "U002",
  content: "좋았습니다.",
  completedAt: "2026.07.01",
  reviewedAt: "2026.07.02",
  hidden: false,
};

const defaultProps = {
  deleteTarget: null,
  deleteCompleteOpen: false,
  visibilityTarget: null,
  visibilityCompleteOpen: false,
  isProcessing: false,
  onConfirmDelete: jest.fn(),
  onCancelDelete: jest.fn(),
  onCloseComplete: jest.fn(),
  onConfirmVisibility: jest.fn(),
  onCancelVisibility: jest.fn(),
  onCloseVisibilityComplete: jest.fn(),
};

describe("ReviewDeleteModals 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("후기 삭제 모달에서 삭제와 취소 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onConfirmDelete = jest.fn();
    const onCancelDelete = jest.fn();

    render(
      <ReviewDeleteModals
        {...defaultProps}
        deleteTarget={review}
        onConfirmDelete={onConfirmDelete}
        onCancelDelete={onCancelDelete}
      />
    );

    expect(screen.getByText("후기 삭제")).toBeVisible();
    expect(screen.getByText("선택한 후기를 삭제하시겠습니까?")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "삭제" }));
    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(onConfirmDelete).toHaveBeenCalledTimes(1);
    expect(onCancelDelete).toHaveBeenCalledTimes(1);
  });

  test("삭제 완료 모달 확인 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onCloseComplete = jest.fn();

    render(
      <ReviewDeleteModals
        {...defaultProps}
        deleteCompleteOpen
        onCloseComplete={onCloseComplete}
      />
    );

    expect(screen.getByText("삭제 완료")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(onCloseComplete).toHaveBeenCalledTimes(1);
  });

  test("숨김 상태 변경 모달에서 확인과 취소 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onConfirmVisibility = jest.fn();
    const onCancelVisibility = jest.fn();

    render(
      <ReviewDeleteModals
        {...defaultProps}
        visibilityTarget={review}
        onConfirmVisibility={onConfirmVisibility}
        onCancelVisibility={onCancelVisibility}
      />
    );

    expect(screen.getByText("후기 숨김 상태 변경")).toBeVisible();
    expect(screen.getByText("선택한 후기를 숨김 처리하시겠습니까?")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "확인" }));
    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(onConfirmVisibility).toHaveBeenCalledTimes(1);
    expect(onCancelVisibility).toHaveBeenCalledTimes(1);
  });

  test("처리 중이면 확인 버튼이 비활성화된다", () => {
    render(
      <ReviewDeleteModals
        {...defaultProps}
        deleteTarget={review}
        isProcessing
      />
    );

    expect(screen.getByRole("button", { name: "처리 중..." })).toBeDisabled();
  });
});
