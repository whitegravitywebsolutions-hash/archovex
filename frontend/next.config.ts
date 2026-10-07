import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'shreesaikrishnaart.in',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/designs',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/designs/:slug*',
        destination: '/blogs/:slug*',
        permanent: true,
      },
      {
        source: '/cities',
        destination: '/locations',
        permanent: true,
      },
      {
        source: '/cities/:slug*',
        destination: '/locations/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
