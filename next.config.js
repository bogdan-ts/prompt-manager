/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  typescript: {
    // Temporarily disable type checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily disable ESLint during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
