import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Minimal config for stable builds */
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Keep tracing rooted to this project when parent folders contain lockfiles.
  outputFileTracingRoot: process.cwd(),
  
  // Basic image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Basic optimizations
  compress: true,
  poweredByHeader: false,

  // Avoid bundling Node-only modules for the browser
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
      };
    }
    return config;
  },
  
  // Permanent redirect: /calculator hub → /calculators hub
  async redirects() {
    return [
      { source: '/calculator', destination: '/calculators', permanent: true },
      { source: '/garages', destination: '/garage-builder', permanent: true },
      { source: '/additions', destination: '/room-additions', permanent: true },
      { source: '/outdoor-living', destination: '/services', permanent: true },
      { source: '/outdoor-living/covered-patios', destination: '/outdoor-living/screened-porches', permanent: true },
      { source: '/service-areas', destination: '/areas', permanent: true },
      { source: '/service-areas/simpsonville-sc', destination: '/service-areas/simpsonville', permanent: true },
      { source: '/service-areas/mauldin-sc', destination: '/service-areas/mauldin', permanent: true },
      { source: '/service-areas/fountain-inn-sc', destination: '/service-areas/fountain-inn', permanent: true },
      { source: '/service-areas/woodruff-sc', destination: '/service-areas/woodruff', permanent: true },
      { source: '/work', destination: '/projects', permanent: true },
      { source: '/pricing', destination: '/services', permanent: true },
    ];
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
