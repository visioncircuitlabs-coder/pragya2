import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  // Server-side rendering mode (no static export)
  // Compatible with PM2 + Nginx deployment
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'img.logo.dev',
      },
    ],
  },
};

export default nextConfig;