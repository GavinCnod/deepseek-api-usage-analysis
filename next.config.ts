import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
