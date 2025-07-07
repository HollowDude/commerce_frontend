/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'example.com',
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      }
    ],
    unoptimized: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
