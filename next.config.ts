import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.motify.gr",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:locale(el)/nea/:path*",
        destination: "/:locale/news/:path*",
      },
      {
        source: "/nea/:path*",
        destination: "/el/news/:path*",
      },
    ];
  },
};

export default nextConfig;
