import type { NextConfig } from "next";

/** API proxy is handled at runtime by `src/app/api/[...path]/route.ts` (reads API_PROXY_TARGET). */
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
