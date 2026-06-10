import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "algoga-bucket.kro.kr",
        pathname: "/algoga-banner/banners/**",
      },
      {
        protocol: "https",
        hostname: "algoga-bucket.kro.kr",
        pathname: "/algoga-userprofile/profiles/**",
      },
      {
        protocol: "https",
        hostname: "algoga-bucket.kro.kr",
        pathname: "/algoga-community/posts/**",
      },
      {
        protocol: "https",
        hostname: "algoga-bucket.kro.kr",
        pathname: "/algoga-accommodation/accommodation/images/**",
      },
      {
        protocol: "https",
        hostname: "algoga-bucket.kro.kr",
        pathname: "/algoga-lms/lms/course-thumbnails/**",
      },
    ],
  },
};

export default nextConfig;