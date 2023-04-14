/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@boilerplate/shared", "@boilerplate/ui", "@boilerplate/api", "@boilerplate/database"],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
