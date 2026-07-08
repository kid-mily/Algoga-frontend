import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});


const nextConfig: NextConfig = {
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
  allowedDevOrigins: [
    'algoga.kro.kr', 'https://algoga.kro.kr', 
    'kidmily.kro.kr', 'https://kidmily.kro.kr'
  ],

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
