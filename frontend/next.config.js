/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/billing/:path*',
        destination: 'http://localhost:3002/api/v1/billing/:path*',
      },
      {
        source: '/api/v1/users/:path*',
        destination: 'http://localhost:3002/api/v1/users/:path*',
      },
      {
        source: '/api/v1/metrics/:path*',
        destination: 'http://localhost:3002/api/v1/metrics/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3002/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
