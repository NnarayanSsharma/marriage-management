import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Integration tests run alongside the developer's existing local server.
  distDir: process.env.AUTH_TEST_BUILD === "1" ? ".next/auth-test" : ".next",
  poweredByHeader: false,
  logging: { incomingRequests: false },
};

export default nextConfig;
