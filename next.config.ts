import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}