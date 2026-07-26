const USER_SESSION_KEY = "algoga-user-session-active";

const canUseSessionStorage = () => typeof window !== "undefined";

export const markUserSessionActive = () => {
  if (!canUseSessionStorage()) return;

  sessionStorage.setItem(USER_SESSION_KEY, "true");
};

export const clearUserSessionActive = () => {
  if (!canUseSessionStorage()) return;

  sessionStorage.removeItem(USER_SESSION_KEY);
};

export const isUserSessionActive = () => {
  if (!canUseSessionStorage()) return false;

  return (
    sessionStorage.getItem(USER_SESSION_KEY) === "true" ||
    Boolean(localStorage.getItem("accessToken")) ||
    Boolean(localStorage.getItem("refreshToken"))
  );
};
