import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BannerManageClient from "@/features/csadmin/banner/components/BannerManageClient";
import { useAdminBannerList } from "@/features/csadmin/banner/hooks/useAdminBannerList";
import type { AdminBanner } from "@/features/csadmin/banner/types";

jest.mock("@/features/csadmin/banner/hooks/useAdminBannerList", () => ({
  useAdminBannerList: jest.fn(),
}));

const banners: AdminBanner[] = [
  {
    bannerId: 1,
    displayId: "B001",
    imageUrl: "/banner.png",
    fileType: "IMAGE",
    linkUrl: "https://algoga.kro.kr/event",
    text: "여름 이벤트",
    isVisible: true,
    createdAt: "2026.07.16",
  },
];

const createHookValue = (override = {}) => ({
  searchKeyword: "",
  visibilityFilter: "ALL",
  filteredBanners: banners,
  totalCount: 1,
  activeCount: 1,
  isLoading: false,
  error: "",
  message: "",
  deleteTargetId: null,
  setSearchKeyword: jest.fn(),
  setVisibilityFilter: jest.fn(),
  setMessage: jest.fn(),
  openDeleteModal: jest.fn(),
  closeDeleteModal: jest.fn(),
  deleteBanner: jest.fn(),
  ...override,
});

describe("BannerManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("배너 목록과 등록 버튼을 렌더링한다", () => {
    (useAdminBannerList as jest.Mock).mockReturnValue(createHookValue());

    render(<BannerManageClient initialBanners={banners} />);

    expect(screen.getAllByText("배너 관리")[0]).toBeVisible();
    expect(screen.getByText("총 1건 | 노출 1건")).toBeVisible();
    expect(screen.getByText("여름 이벤트")).toBeVisible();
    expect(screen.getByRole("link", { name: "배너 등록" })).toHaveAttribute(
      "href",
      "/csadmin/banner/new"
    );
  });

  test("검색어와 노출 필터를 변경하면 hook setter를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useAdminBannerList as jest.Mock).mockReturnValue(hookValue);

    render(<BannerManageClient initialBanners={banners} />);

    await user.type(screen.getByPlaceholderText("배너 문구 또는 URL 검색"), "이벤트");
    await user.selectOptions(screen.getByDisplayValue("전체"), "VISIBLE");

    expect(hookValue.setSearchKeyword).toHaveBeenCalled();
    expect(hookValue.setVisibilityFilter).toHaveBeenCalledWith("VISIBLE");
  });

  test("삭제 버튼 클릭 시 삭제 모달을 연다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue();
    (useAdminBannerList as jest.Mock).mockReturnValue(hookValue);

    render(<BannerManageClient initialBanners={banners} />);

    await user.click(screen.getByLabelText("삭제: 배너 1"));

    expect(hookValue.openDeleteModal).toHaveBeenCalledWith(1);
  });

  test("삭제 모달에서 확인하면 deleteBanner를 호출한다", async () => {
    const user = userEvent.setup();
    const hookValue = createHookValue({ deleteTargetId: 1 });
    (useAdminBannerList as jest.Mock).mockReturnValue(hookValue);

    render(<BannerManageClient initialBanners={banners} />);

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(hookValue.deleteBanner).toHaveBeenCalled();
  });

  test("배너가 없으면 빈 상태 문구를 보여준다", () => {
    (useAdminBannerList as jest.Mock).mockReturnValue(
      createHookValue({ filteredBanners: [], totalCount: 0, activeCount: 0 })
    );

    render(<BannerManageClient initialBanners={[]} />);

    expect(screen.getByText("조건에 맞는 배너가 없습니다.")).toBeVisible();
  });
});
