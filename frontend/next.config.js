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
  async redirects() {
    return [
      {
        source: '/files',
        destination: '/collections/files',
        permanent: true,
      },
      {
        source: '/files/:path*',
        destination: '/collections/files/:path*',
        permanent: true,
      },
    ];
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
        source: '/api/v1/admin/:path*',
        destination: 'http://localhost:3002/api/v1/admin/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3002/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
