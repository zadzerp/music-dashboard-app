/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/market-share-analysis',
  assetPrefix: '/market-share-analysis/',
  trailingSlash: true,
}

module.exports = nextConfig
