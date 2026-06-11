export const setCookie = (
  name: string,
  value: string,
  maxAge = 60 * 60 * 24 * 7
) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
};

export const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ");

  const target = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return target ? decodeURIComponent(target.split("=")[1]) : null;
};

export const deleteCookie = (name: string) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${secure}`;
};