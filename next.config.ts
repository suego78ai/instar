import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/instar",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
