import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  // 3. 🌟 핵심: 프록시(우회) 설정 (headers 대신 rewrites 사용)
  async rewrites() {
    return [
      {
        // 프론트엔드에서 /api/... 로 시작하는 요청을 보내면
        source: "/api/:path*",
        // 브라우저 몰래 실제 백엔드(클라우드 서버)로 포워딩합니다.
        // 이렇게 하면 브라우저는 프론트엔드와 백엔드가 "같은 주소"라고 착각하여 쿠키를 정상적으로 통과시킵니다.
        destination: "https://kidmily.kro.kr/api/:path*",
      },
    ];
  },
};

export default nextConfig;