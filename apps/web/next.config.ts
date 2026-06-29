import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@examedge/shared", "@examedge/db", "@examedge/ai"],
};

export default nextConfig;
