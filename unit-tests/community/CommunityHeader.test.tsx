import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CommunityHeader from "@/features/community/components/common/CommunityHeader";

const categories = [
  { id: "ALL", label: "전체", tagType: "ALL" as const },
  {
    id: "TRAVEL_REVIEW",
    label: "여행후기",
    tagType: "CATEGORY" as const,
  },
  { id: "JP", label: "일본", tagType: "COUNTRY" as const },
  {
    id: "ZA",
    label: "남아프리카공화국",
    tagType: "COUNTRY" as const,
  },
];

describe("CommunityHeader", () => {
  test("카테고리는 탭, 국가는 작은 해시태그 필터로 구분한다", () => {
    render(
      <CommunityHeader
        selectedCategories={["TRAVEL_REVIEW", "JP"]}
        categories={categories}
        onCategoryChange={jest.fn()}
        onWriteClick={jest.fn()}
        isMyPostsOnly={false}
        onToggleMyPostsOnly={jest.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "여행후기" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "#일본" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.getByRole("button", { name: "#남아프리카공화국" })
    ).toBeVisible();
  });

  test("글쓰기와 내가 쓴 글 필터 동작을 전달한다", async () => {
    const user = userEvent.setup();
    const onWriteClick = jest.fn();
    const onToggleMyPostsOnly = jest.fn();

    render(
      <CommunityHeader
        selectedCategories={["ALL"]}
        categories={categories}
        onCategoryChange={jest.fn()}
        onWriteClick={onWriteClick}
        isMyPostsOnly
        onToggleMyPostsOnly={onToggleMyPostsOnly}
      />
    );

    await user.click(screen.getByRole("button", { name: "글쓰기" }));
    await user.click(screen.getByRole("button", { name: "내가 쓴 글" }));

    expect(onWriteClick).toHaveBeenCalledTimes(1);
    expect(onToggleMyPostsOnly).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "내가 쓴 글" })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
