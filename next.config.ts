import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "minio",
        port: "9000",
        pathname: "/404chan-files/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/404chan-files/**",
      },
    ],
  },
};

export default nextConfig;
