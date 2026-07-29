import { render, screen } from "@testing-library/react";
import ContentSidebar from "@/features/admin/common/ContentSidebar";

jest.mock("@/features/admin/auth/services/adminDisplay", () => ({
  getCurrentAdminDisplayInfo: jest.fn(() => ({
    initial: "콘",
    name: "콘텐츠 관리자",
    email: "content@algoga.kr",
    role: "SUPER_ADMIN",
  })),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/contentadmin/lecture/deleted",
}));

describe("콘텐츠 관리자 사이드바", () => {
  test("삭제 강의 목록에서는 가장 구체적인 메뉴 하나만 활성화한다", () => {
    render(<ContentSidebar />);

    expect(
      screen.getByRole("link", { name: /삭제 강의 목록/ })
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: /강의 관리/ })
    ).not.toHaveAttribute("aria-current");
  });

  test("슈퍼어드민이 콘텐츠 관리자 화면에 들어오면 복귀 링크를 표시한다", () => {
    render(<ContentSidebar />);

    expect(
      screen.getByRole("link", { name: "슈퍼어드민으로 돌아가기" })
    ).toHaveAttribute("href", "/superadmin/manage");
  });
});
