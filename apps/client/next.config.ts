import type { NextConfig } from "next";

// Bundle analyzer for performance debugging
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['@clerk/nextjs'],
  },

  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  turbopack: {},

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JS and CSS for 1 year (they have hashed filenames)
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...((config.optimization?.splitChunks as any)?.cacheGroups || {}),
            // Separate vendor chunks for better caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate Clerk into its own chunk
            clerk: {
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
              name: 'clerk',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
