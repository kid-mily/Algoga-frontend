export const getSiteUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (!configuredUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required for SEO metadata.");
  }

  if (configuredUrl === "https://algoga.kro.ko") {
    throw new Error("NEXT_PUBLIC_SITE_URL is invalid: https://algoga.kro.ko");
  }

  return configuredUrl;
};
