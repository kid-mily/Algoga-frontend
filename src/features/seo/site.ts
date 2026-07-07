export const getSiteUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (!configuredUrl) {
    return null;
  }

  if (configuredUrl === "https://algoga.kro.ko") {
    return null;
  }

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
  } catch {
    return null;
  }

  return configuredUrl;
};
