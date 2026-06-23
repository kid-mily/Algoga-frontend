const ADMIN_SESSION_KEY = "algoga-admin-session-active";
const ADMIN_ROLE_KEY = "algoga-admin-role";

export const markAdminSessionActive = (role?: string) => {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");

  if (role) {
    sessionStorage.setItem(ADMIN_ROLE_KEY, role.toUpperCase());
  }
};

export const clearAdminSessionActive = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_ROLE_KEY);
};

export const isAdminSessionActive = () => {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
};

export const getAdminSessionRole = () => {
  return sessionStorage.getItem(ADMIN_ROLE_KEY);
};