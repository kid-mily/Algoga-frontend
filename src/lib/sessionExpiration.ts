import {
  clearAdminSessionActive,
  isAdminSessionActive,
} from "@/features/admin/auth/services/adminSession";
import {
  clearUserSessionActive,
  isUserSessionActive,
} from "@/features/auth/services/userSession";

const notifiedLoginPaths = new Set<string>();

export type SessionExpirationReason = "CONCURRENT_LOGIN" | "INACTIVITY";

export const isSessionActiveForLoginPath = (loginPath: string) => {
  if (loginPath === "/auth/adminlogin") {
    return (
      isAdminSessionActive() ||
      Boolean(localStorage.getItem("adminAccessToken")) ||
      Boolean(localStorage.getItem("adminRefreshToken"))
    );
  }

  return isUserSessionActive();
};

export const notifySessionExpired = (
  loginPath: string,
  reason: SessionExpirationReason = "INACTIVITY"
) => {
  if (
    typeof window === "undefined" ||
    notifiedLoginPaths.has(loginPath) ||
    !isSessionActiveForLoginPath(loginPath)
  ) {
    return;
  }

  notifiedLoginPaths.add(loginPath);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");

  if (loginPath === "/auth/adminlogin") {
    clearAdminSessionActive();
  } else {
    clearUserSessionActive();
  }

  window.dispatchEvent(new Event("auth-state-changed"));
  window.dispatchEvent(
    new CustomEvent("session-expired", {
      detail: { loginPath, reason },
    })
  );
};
