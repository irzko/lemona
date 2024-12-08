import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        // pathname: '**',
      },
    ],
  },
  experimental: {
    dynamicIO: true,
    serverActions: {
      allowedOrigins: [
        "friendly-waddle-j9g4vw94762x6v-3000.app.github.dev",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
