/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimize for production
  reactStrictMode: true,
  
  // Enable Turbopack for faster builds (Next.js 16+)
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  
  // Enable standalone output for Docker deployment (optional)
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
};

export default nextConfig;
