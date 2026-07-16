import { render, screen } from "@testing-library/react";
import BannerMediaPreview from "@/features/csadmin/banner/components/BannerMediaPreview";

describe("BannerMediaPreview 컴포넌트 테스트", () => {
  test("이미지 타입이면 img를 렌더링한다", () => {
    render(
      <BannerMediaPreview
        src="/banner.png"
        fileType="IMAGE"
        alt="배너 이미지"
      />
    );

    expect(screen.getByAltText("배너 이미지")).toHaveAttribute("src", "/banner.png");
  });

  test("영상 타입이면 video를 렌더링한다", () => {
    render(
      <BannerMediaPreview
        src="/banner.mp4"
        fileType="VIDEO"
        alt="배너 영상"
      />
    );

    expect(screen.getByLabelText("배너 영상")).toHaveAttribute("src", "/banner.mp4");
  });

  test("src가 없으면 미디어 없음 상태를 보여준다", () => {
    render(<BannerMediaPreview src="" fileType="IMAGE" alt="빈 배너" />);

    expect(screen.getByText("미디어 없음")).toBeVisible();
  });
});
