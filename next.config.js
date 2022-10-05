/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["upload.wikimedia.org", "www.pngitem.com", "replicate.com"],
  },
};

module.exports = nextConfig;
