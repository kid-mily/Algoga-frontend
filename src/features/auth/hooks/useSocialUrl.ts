export const useSocialUrls = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  const hasSocialLoginConfig = Boolean(apiBaseUrl);
  const socialLoginUrls = hasSocialLoginConfig
    ? {
        kakao: `${apiBaseUrl}/oauth2/authorization/kakao`,
        google: `${apiBaseUrl}/oauth2/authorization/google`,
      }
    : null;

  return {
    hasSocialLoginConfig,
    socialLoginUrls,
  };
};
