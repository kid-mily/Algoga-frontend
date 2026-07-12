import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

const getHostnameFromEnv = (value?: string) => {
  if (!value) return null;

  try {
    return new URL(value).hostname;
  } catch {
    return value.replace(/^https?:\/\//, "").replace(/\/$/, "") || null;
  }
};

const apiProxyHostname = getHostnameFromEnv(process.env.API_PROXY_TARGET);
const siteHostname = getHostnameFromEnv(process.env.NEXT_PUBLIC_SITE_URL);
const allowedDevOrigins = Array.from(
  new Set(
    [siteHostname, apiProxyHostname]
      .filter((hostname): hostname is string => Boolean(hostname))
      .flatMap((hostname) => [hostname, `https://${hostname}`])
  )
);

const nextConfig: NextConfig = {
  // Docker(ECS) 배포용: 최소 실행 파일만 담긴 standalone 서버 출력
  output: "standalone",

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 1. 외부 이미지 도메인 허용 (기존 설정 유지 ✅)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "algoga-bucket.kro.kr", pathname: "/algoga-banner/banners/**" },
      { protocol: "https", hostname: "algoga-bucket.kro.kr", pathname: "/algoga-userprofile/profiles/**" },
      { protocol: "https", hostname: "algoga-bucket.kro.kr", pathname: "/algoga-community/posts/**" },
      { protocol: "https", hostname: "algoga-bucket.kro.kr", pathname: "/algoga-accommodation/accommodation/images/**" },
      { protocol: "https", hostname: "algoga-bucket.kro.kr", pathname: "/algoga-lms/lms/course-thumbnails/**" },
      { protocol: "https", hostname: "algoga-bucket.kro.kr", pathname: "/algoga-accommodation/accommodation/images/**" },
      { protocol: "https", hostname: "algoga-bucket.kro.kr", pathname: "/algoga-package/package/images/**" },
    ],
  },

  // 2. 로컬 개발 시 외부 도메인 접속 허용 (기존 설정 유지 ✅)
  allowedDevOrigins,

  // /public/data 아래 정적 파일을 30알 동안 브라우저에 캐시
  async headers() {
    return [
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
