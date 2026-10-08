import type { NextConfig } from "next";

// GitHub Pages serves the repo under /<repo>; the deploy workflow sets NEXT_PUBLIC_BASE_PATH=/Anubi.
// Locally it is unset, so `npm run dev` stays at http://localhost:3000/.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
