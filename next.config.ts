import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "algoga-bucket.kro.kr",
      },
    ],
  },
};

export default nextConfig;
