import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Minimal config for stable builds */
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Modern compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Tree-shake lucide-react icons for smaller bundles
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      skipDefaultConversion: true,
    },
  },

  experimental: {
    // Keep initial render CSS on a single path to reduce critical request chains.
    cssChunking: false,
    // Inline and optimize above-the-fold CSS where possible.
    optimizeCss: {
      critters: {
        preload: 'swap',
        pruneSource: false,
        // Inline critical CSS up to 50KB
        inlineThreshold: 50000,
        // Minimum external CSS file size
        minimumExternalSize: 1000,
        // Inline font definitions for faster rendering
        inlineFonts: true,
      },
    },
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
