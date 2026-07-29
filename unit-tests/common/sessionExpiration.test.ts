import { markUserSessionActive } from "@/features/auth/services/userSession";
import { notifySessionExpired } from "@/lib/sessionExpiration";

describe("notifySessionExpired", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  test("로그인한 적 없는 비로그인 사용자에게는 만료 이벤트를 보내지 않는다", () => {
    const listener = jest.fn();
    window.addEventListener("session-expired", listener);

    notifySessionExpired("/auth/login");

    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener("session-expired", listener);
  });

  test("활성 사용자 세션이 있었을 때만 만료 이벤트를 한 번 보낸다", () => {
    const listener = jest.fn();
    window.addEventListener("session-expired", listener);
    markUserSessionActive();

    notifySessionExpired("/auth/login");
    notifySessionExpired("/auth/login");

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        detail: {
          loginPath: "/auth/login",
          reason: "INACTIVITY",
        },
      })
    );
    expect(sessionStorage.getItem("algoga-user-session-active")).toBeNull();
    window.removeEventListener("session-expired", listener);
  });
});
