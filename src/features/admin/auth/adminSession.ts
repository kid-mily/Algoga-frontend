const ADMIN_SESSION_KEY = "algoga-admin-session-active";

export const markAdminSessionActive = () => {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
};

export const clearAdminSessionActive = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminSessionActive = () => {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
};
