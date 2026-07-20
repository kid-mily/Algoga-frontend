import { render, screen } from "@testing-library/react";
import SuperAdminSidebar from "@/features/admin/common/SuperAdminSidebar";

jest.mock("@/features/admin/auth/services/adminDisplay", () => ({
  getCurrentAdminDisplayInfo: jest.fn(() => ({
    name: "슈퍼관리자",
    email: "super@algoga.kr",
  })),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/superadmin/manage",
}));

describe("슈퍼어드민 사이드바 테스트", () => {
  test("슈퍼어드민 메뉴와 매니저 이동 링크가 렌더링된다", () => {
    render(<SuperAdminSidebar />);

    expect(screen.getByText("Super Admin")).toBeVisible();
    expect(screen.getByRole("link", { name: /관리자 계정 관리/ })).toHaveAttribute(
      "href",
      "/superadmin/manage"
    );
    expect(screen.getByRole("link", { name: /블랙리스트 관리/ })).toHaveAttribute(
      "href",
      "/superadmin/blacklist"
    );
    expect(screen.getByRole("link", { name: /컨텐츠매니저로 이동/ })).toHaveAttribute(
      "href",
      "/contentadmin/lecture"
    );
    expect(screen.getByRole("link", { name: /CS매니저로 이동/ })).toHaveAttribute(
      "href",
      "/csadmin/inquiry"
    );
    expect(screen.getByRole("link", { name: /통계매니저로 이동/ })).toHaveAttribute(
      "href",
      "/statisticadmin/finance-status"
    );
    expect(screen.getByRole("link", { name: /정산 매니저로 이동/ })).toHaveAttribute(
      "href",
      "/moneyadmin/payments"
    );
    expect(screen.getByText("슈퍼관리자")).toBeVisible();
    expect(screen.getByText("super@algoga.kr")).toBeVisible();
  });
});
