import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SessionExpiredModal from "@/features/common/components/SessionExpiredModal";

const replace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("SessionExpiredModal", () => {
  beforeEach(() => {
    replace.mockClear();
  });

  test("세션 만료 이벤트를 받으면 안내를 보여준다", () => {
    render(<SessionExpiredModal />);

    act(() => {
      window.dispatchEvent(
        new CustomEvent("session-expired", {
          detail: { loginPath: "/auth/adminlogin" },
        })
      );
    });

    expect(
      screen.getByRole("dialog", { name: "세션이 만료되었습니다" })
    ).toBeVisible();
    expect(
      screen.getByText(/로그인 후 30분이 지나 자동으로 로그아웃되었습니다/)
    ).toBeVisible();
  });

  test("확인하면 이벤트에 지정된 로그인 화면으로 이동한다", async () => {
    const user = userEvent.setup();

    render(<SessionExpiredModal />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("session-expired", {
          detail: { loginPath: "/auth/adminlogin" },
        })
      );
    });

    await user.click(
      screen.getByRole("button", { name: "로그인 화면으로 이동" })
    );

    expect(replace).toHaveBeenCalledWith("/auth/adminlogin");
    expect(
      screen.queryByRole("dialog", { name: "세션이 만료되었습니다" })
    ).not.toBeInTheDocument();
  });
});
