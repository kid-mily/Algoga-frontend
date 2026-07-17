/* eslint-disable @next/next/no-img-element */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserActivityListClient from "@/features/csadmin/user/components/UserActivityListClient";
import { getAdminUsers } from "@/features/services/adminUserActivity.service";

jest.mock("@/features/services/adminUserActivity.service", () => ({
  getAdminUsers: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <img src={props.src} alt={props.alt} />
  ),
}));

const users = [
  {
    userId: 7,
    displayId: "U007",
    nickname: "여행러버",
    email: "travel@example.com",
    createdAt: "2026.07.10",
    friendCount: 3,
    postCount: 5,
    commentCount: 8,
  },
];

const userPage = {
  items: users,
  page: 1,
  totalPages: 2,
  totalElements: 11,
};

describe("UserActivityListClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAdminUsers as jest.Mock).mockResolvedValue(userPage);
  });

  test("유저 목록과 활동 수치를 렌더링한다", async () => {
    render(<UserActivityListClient />);

    expect(screen.getByText("유저 목록을 불러오는 중입니다...")).toBeVisible();

    expect(await screen.findByText("여행러버")).toBeVisible();
    expect(screen.getByText("U007")).toBeVisible();
    expect(screen.getByText("travel@example.com")).toBeVisible();
    expect(screen.getByText("총 11명")).toBeVisible();
    expect(screen.getByText("총 11건")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "여행러버 친구 목록 보기" })
    ).toHaveAttribute("href", "/csadmin/user/7/friend");
  });

  test("검색어를 입력하면 첫 페이지 기준으로 유저 목록을 다시 요청한다", async () => {
    const user = userEvent.setup();

    render(<UserActivityListClient />);

    await screen.findByText("여행러버");
    await user.type(screen.getByPlaceholderText("회원 ID, 닉네임, 이메일 검색"), "러버");

    await waitFor(() => {
      expect(getAdminUsers).toHaveBeenLastCalledWith(
        1,
        10,
        "러버",
        expect.any(AbortSignal)
      );
    });
  });

  test("다음 페이지 버튼을 누르면 다음 페이지 데이터를 요청한다", async () => {
    const user = userEvent.setup();
    (getAdminUsers as jest.Mock).mockImplementation((page: number) =>
      Promise.resolve({ ...userPage, page })
    );

    render(<UserActivityListClient />);

    await screen.findByText("여행러버");
    await user.click(screen.getByRole("button", { name: "다음" }));

    await waitFor(() => {
      expect(getAdminUsers).toHaveBeenCalledWith(
        2,
        10,
        "",
        expect.any(AbortSignal)
      );
    });
  });

  test("유저가 없으면 빈 상태 문구를 보여준다", async () => {
    (getAdminUsers as jest.Mock).mockResolvedValue({
      items: [],
      page: 1,
      totalPages: 1,
      totalElements: 0,
    });

    render(<UserActivityListClient />);

    expect(await screen.findByText("유저 목록이 없습니다.")).toBeVisible();
  });
});
