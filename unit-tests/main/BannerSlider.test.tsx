import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BannerSlider from "@/features/main/banner/components/BannerSlider";

jest.mock("next/image", () => {
    return function ImageMock({
        alt,
        src, 
    }: {
        alt: string;
        src: string;
    }) {
        return <img alt={alt} src={src} />;
    };
});

const banners = [
    {
        bannerId: 1,
        imageUrl: "/images/banner-1.png",
        linkUrl: "/classroom",
        text: "첫 번째 배너",
    },
    {
        bannerId: 2,
        imageUrl: "/images/banner-2.png",
        linkUrl: "/notice",
        text: "두 번째 배너",
    },
];

describe("BannerSlider", () => {
    test("배너가 없으면 안내 문구를 보여준다", () => {
        render(<BannerSlider banners={[]} />);

        expect(screen.getByText("배너를 불러오지 못했습니다.")).toBeInTheDocument();
    });

    test("배너 이미지를 렌더링한다", () => {
        render(<BannerSlider banners={banners} />);

        expect(screen.getByAltText("첫 번째 배너")).toBeInTheDocument();
        expect(screen.getByAltText("두 번째 배너")).toBeInTheDocument();
    });

    test("다음 배너 버튼을 누르면 활성 배너가 바뀐다", async () => {
        const user = userEvent.setup();

        render(<BannerSlider banners={banners} />);

        const firstBannerLink = screen.getByAltText("첫 번째 배너").closest("a");
        const secondBannerLink = screen.getByAltText("두 번째 배너").closest("a");

        expect(firstBannerLink).toHaveAttribute("aria-hidden", "false");
        expect(secondBannerLink).toHaveAttribute("aria-hidden", "true");

        await user.click(screen.getByRole("button", { name: "다음 배너 보기" }));

        expect(firstBannerLink).toHaveAttribute("aria-hidden", "true");
        expect(secondBannerLink).toHaveAttribute("aria-hidden", "false");
    });

    test("인디케이터 버튼을 누르면 해당 배너가 활성화된다", async () => {
        const user = userEvent.setup();

        render(<BannerSlider banners={banners} />);

        await user.click(screen.getByRole("button", { name: "2번째 배너 보기" }));

        expect(screen.getByRole("button", { name: "2번째 배너 보기" })).toHaveAttribute(
        "aria-current",
        "true"
        );
    });
});