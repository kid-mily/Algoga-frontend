import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewCard from "@/features/contentmanage/review/components/ReviewCard";
import type { AdminReview } from "@/features/contentmanage/review/types";

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
  level: "중급",
  packageName: "도쿄 완전 정복 2024",
  rating: 4.5,
  user: "김알고",
  userId: "U001",
  content: "여행 준비에 도움이 많이 됐습니다.",
  completedAt: "2026.07.01",
  reviewedAt: "2026.07.03",
  hidden: false,
};

describe("ReviewCard 컴포넌트 테스트", () => {
  test("후기 정보를 렌더링한다", () => {
    render(
      <ReviewCard
        review={review}
        onVisibilityChange={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("중급")).toBeVisible();
    expect(screen.getByText("도쿄 완전 정복 2024")).toBeVisible();
    expect(screen.getByText("4.5")).toBeVisible();
    expect(screen.getByText("김알고")).toBeVisible();
    expect(screen.getByText("(U001)")).toBeVisible();
    expect(screen.getByText("여행 준비에 도움이 많이 됐습니다.")).toBeVisible();
    expect(screen.getByText(/수료일 2026.07.01/)).toBeVisible();
    expect(screen.getByText(/후기 작성 2026.07.03/)).toBeVisible();
  });

  test("숨김 후기이면 숨김 배지와 노출 버튼을 표시한다", () => {
    render(
      <ReviewCard
        review={{ ...review, hidden: true }}
        onVisibilityChange={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("숨김")).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "도쿄 완전 정복 2024 김알고 후기 숨김 상태 변경",
      })
    ).toBeVisible();
  });

  test("숨김 상태 변경과 삭제 콜백을 호출한다", async () => {
    const user = userEvent.setup();
    const onVisibilityChange = jest.fn();
    const onDelete = jest.fn();

    render(
      <ReviewCard
        review={review}
        onVisibilityChange={onVisibilityChange}
        onDelete={onDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "도쿄 완전 정복 2024 김알고 후기 숨김 상태 변경",
      })
    );
    await user.click(
      screen.getByRole("button", {
        name: "도쿄 완전 정복 2024 김알고 후기 삭제",
      })
    );

    expect(onVisibilityChange).toHaveBeenCalledWith(review);
    expect(onDelete).toHaveBeenCalledWith(review);
  });
});
