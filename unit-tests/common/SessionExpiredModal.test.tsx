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

  test("장시간 미활동 이벤트를 받으면 세션 만료 안내를 보여준다", () => {
    render(<SessionExpiredModal />);

    act(() => {
      window.dispatchEvent(
        new CustomEvent("session-expired", {
          detail: {
            loginPath: "/auth/adminlogin",
            reason: "INACTIVITY",
          },
        })
      );
    });

    expect(
      screen.getByRole("dialog", { name: "세션이 만료되었습니다" })
    ).toBeVisible();
    expect(
      screen.getByText(/30분간 활동이 없어 자동으로 로그아웃되었습니다/)
    ).toBeVisible();
  });

  test("다른 기기 로그인 이벤트를 받으면 동시 로그인 안내를 보여준다", () => {
    render(<SessionExpiredModal />);

    act(() => {
      window.dispatchEvent(
        new CustomEvent("session-expired", {
          detail: {
            loginPath: "/auth/login",
            reason: "CONCURRENT_LOGIN",
          },
        })
      );
    });

    expect(
      screen.getByRole("dialog", {
        name: "다른 기기에서 로그인되었습니다",
      })
    ).toBeVisible();
    expect(
      screen.getByText(/다른 기기에서 동일한 계정으로 로그인하여/)
    ).toBeVisible();
  });

  test("확인하면 이벤트에 지정된 로그인 화면으로 이동한다", async () => {
    const user = userEvent.setup();

    render(<SessionExpiredModal />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("session-expired", {
          detail: {
            loginPath: "/auth/adminlogin",
            reason: "INACTIVITY",
          },
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
