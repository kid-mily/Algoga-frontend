export const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ");

  const target = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return target ? decodeURIComponent(target.split("=")[1]) : null;
};

const getCookieDeleteDomains = () => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return [""];
  }

  const parts = hostname.split(".");
  const rootDomain = parts.length >= 3 ? parts.slice(-3).join(".") : hostname;

  return ["", hostname, `.${hostname}`, rootDomain, `.${rootDomain}`];
};

export const deleteCookie = (name: string) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  getCookieDeleteDomains().forEach((domain) => {
    const domainPart = domain ? `; domain=${domain}` : "";

    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${secure}${domainPart}`;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}${domainPart}`;
  });
};