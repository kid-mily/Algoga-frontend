import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BannerCard from "@/features/csadmin/banner/components/BannerCard";
import type { AdminBanner } from "@/features/csadmin/banner/types";

const banner: AdminBanner = {
  bannerId: 7,
  displayId: "B007",
  imageUrl: "/banner.png",
  fileType: "IMAGE",
  linkUrl: "https://algoga.kro.kr/event",
  text: "특가 이벤트",
  isVisible: true,
  createdAt: "2026.07.16",
};

describe("BannerCard 컴포넌트 테스트", () => {
  test("배너 정보를 렌더링한다", () => {
    render(<BannerCard banner={banner} onDelete={jest.fn()} />);

    expect(screen.getByText("특가 이벤트")).toBeVisible();
    expect(screen.getByText("B007 · 이미지")).toBeVisible();
    expect(screen.getByText("노출")).toBeVisible();
    expect(screen.getByText("노출 중")).toBeVisible();
    expect(screen.getByText("https://algoga.kro.kr/event")).toBeVisible();
    expect(screen.getByAltText("특가 이벤트")).toHaveAttribute("src", "/banner.png");
  });

  test("수정 링크와 삭제 버튼을 제공한다", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<BannerCard banner={banner} onDelete={onDelete} />);

    expect(screen.getByLabelText("수정: 배너 7")).toHaveAttribute(
      "href",
      "/csadmin/banner/7"
    );

    await user.click(screen.getByLabelText("삭제: 배너 7"));

    expect(onDelete).toHaveBeenCalledWith(7);
  });

  test("숨김 상태 배너를 렌더링한다", () => {
    render(
      <BannerCard
        banner={{
          ...banner,
          isVisible: false,
        }}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getAllByText("숨김")).toHaveLength(2);
  });
});
