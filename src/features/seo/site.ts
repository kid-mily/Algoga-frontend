export const DEFAULT_SITE_URL = "https://algoga.kro.kr";

export const getSiteUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (!configuredUrl) {
    return DEFAULT_SITE_URL;
  }

  if (configuredUrl === "https://algoga.kro.ko") {
    return DEFAULT_SITE_URL;
  }

  return configuredUrl;
};
