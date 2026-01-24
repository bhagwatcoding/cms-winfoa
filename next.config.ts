/**
 * Professional Multi-Subdomain Next.js Configuration
 * Optimized for performance, security, and scalability
 * 
 * @module NextConfig
 * @description Enterprise-grade configuration for multi-tenant applications
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // =============================================================================
  // PERFORMANCE OPTIMIZATIONS
  // =============================================================================

  // Enable React 19 concurrent features
  reactStrictMode: true,

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // SWC minification enabled by default in Next.js 15

  // Optimize images
  images: {
    domains: [
      'localhost',
      'vercel.app',
      'vercel.com',
      // Add your production domains here
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // =============================================================================
  // EXPERIMENTAL FEATURES
  // =============================================================================

  experimental: {
    // Enable React Server Components
    serverComponentsExternalPackages: ['mongoose'],

    // Optimize CSS
    optimizeCss: true,

    // Enable Webpack build worker
    webpackBuildWorker: true,
  },

  // =============================================================================
  // WEBPACK OPTIMIZATIONS
  // =============================================================================

  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Separate UI components
          ui: {
            test: /[\\/]src[\\/]shared[\\/]components[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Separate utility functions
          utils: {
            test: /[\\/]src[\\/]shared[\\/]lib[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 15,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Optimize for server-side
    if (isServer) {
      config.externals = [...(config.externals || []), 'mongoose'];
    }

    // Add bundle analyzer for analysis
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    return config;
  },

  // =============================================================================
  // HEADERS & SECURITY
  // =============================================================================

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" },

          // Performance headers
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'ETag', value: 'strong' },

          // Subdomain optimization
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // =============================================================================
  // REDIRECTS & REWRITES
  // =============================================================================

  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.yourdomain.com' }],
        destination: 'https://yourdomain.com/:path*',
        permanent: true,
      },

      // Redirect HTTP to HTTPS
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://yourdomain.com/:path*',
        permanent: true,
      },

      // Redirect old auth routes
      {
        source: '/auth/:path*',
        destination: '/auth/:path*',
        permanent: false, // Handled by middleware
      },
    ];
  },

  // =============================================================================
  // ENVIRONMENT CONFIGURATION
  // =============================================================================

  env: {
    // Custom environment variables
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // =============================================================================
  // TYPESCRIPT CONFIGURATION
  // =============================================================================

  typescript: {
    // Type checking during build (set to false for faster builds in development)
    ignoreBuildErrors: process.env.NODE_ENV === 'development',

    // Custom TypeScript configuration
    tsconfigPath: './tsconfig.json',
  },

  // =============================================================================
  // COMPRESSION & OPTIMIZATION
  // =============================================================================

  // Enable compression
  compress: true,

  // Generate ETags
  generateEtags: true,

  // Powered by header
  poweredByHeader: false,

  // =============================================================================
  // SUBDOMAIN-SPECIFIC CONFIGURATIONS
  // =============================================================================

  // Base path configuration for different deployments
  basePath: '',

  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',

  // =============================================================================
  // DEVELOPMENT CONFIGURATION
  // =============================================================================

  // Development mode optimizations handled automatically by Next.js 15

  // =============================================================================
  // ANALYTICS & MONITORING
  // =============================================================================

  // Web Vitals reporting configured in instrumentation.ts
};

export default nextConfig;