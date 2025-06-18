import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'], // ✅ Add this line to fix the error
  },
};

export default nextConfig;
