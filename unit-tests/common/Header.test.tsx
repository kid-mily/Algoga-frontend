import { render, screen } from "@testing-library/react";

import Header from "@/features/common/components/Header";
import { getMe } from "@/features/services/user.service";

jest.mock("@/features/services/user.service", () => ({
  getMe: jest.fn(),
}));

jest.mock("@/features/common/components/Navbar", () => {
  return function MockNavbar({ mobile }: { mobile?: boolean }) {
    return <div>{mobile ? "모바일 내비게이션" : "데스크톱 내비게이션"}</div>;
  };
});

jest.mock("@/features/common/components/Profile", () => {
  return function MockProfile({ mobile }: { mobile?: boolean }) {
    return <div>{mobile ? "모바일 프로필" : "데스크톱 프로필"}</div>;
  };
});

const mockedGetMe = jest.mocked(getMe);

describe("Header", () => {
  beforeEach(() => {
    mockedGetMe.mockResolvedValue(null);
  });

  test("모바일 내비게이션을 별도 조작 없이 항상 렌더링한다", async () => {
    render(<Header />);

    expect(await screen.findByText("모바일 내비게이션")).toBeVisible();
    expect(screen.getByText("데스크톱 내비게이션")).toBeVisible();
    expect(screen.getByText("모바일 프로필")).toBeVisible();
    expect(screen.queryByRole("button", { name: "메뉴 열기" })).toBeNull();
  });
});
