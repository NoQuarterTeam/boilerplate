// /** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: [
    "@boilerplate/shared",
    "@boilerplate/ui",
    "@boilerplate/api",
    "@boilerplate/tailwind-config",
    "@boilerplate/database",
  ],
  experimental: {
    appDir: true,
  },
}
