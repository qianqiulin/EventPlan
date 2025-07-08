import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: false
      }
    ]
  },
  experimental: {
    forceSwcTransforms: true, // ✅ Forces SWC even if Babel is present
  },
};

export default nextConfig;
