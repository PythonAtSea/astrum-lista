import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://images-assets.nasa.gov/**")],
  },
};

export default nextConfig;
