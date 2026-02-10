import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
  return [
    {
      source: '/en/nea/:path*',
      destination: '/en/news/:path*',
      permanent: true,
    },
    {
      source: '/news/:path*',
      destination: '/nea/:path*',
      permanent: true,
    },
    {
      source: '/el/news/:path*',
      destination: '/nea/:path*',
      permanent: true,
    },
    {
      source: '/works',
      destination: '/ta-erga-mas',
      permanent: true,
    },
    {
      source: '/services',
      destination: '/ti-kanoume',
      permanent: true,
    },
    {
      source: '/about',
      destination: '/sxetika',
      permanent: true,
    },
  ];
  },
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
