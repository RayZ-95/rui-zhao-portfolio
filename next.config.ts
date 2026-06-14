import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      {
        source: "/design/tang-dynasty-robe-study",
        destination: "/design/master-portfolio",
        permanent: true
      },
      {
        source: "/design/gender-blurred-deconstructed-menswear",
        destination: "/design/explore-boy",
        permanent: true
      }
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb"
    }
  }
};

export default nextConfig;
