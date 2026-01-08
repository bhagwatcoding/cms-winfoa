import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Fix all TypeScript errors
  },
  experimental: {
    // serverActions: true, // Default in 14+
  }
};

export default nextConfig;