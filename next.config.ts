import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

function apiImagePatterns() {
  if (!apiOrigin) {
    return [];
  }

  try {
    const { protocol, hostname, port } = new URL(apiOrigin);

    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/storage/**"
      }
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiImagePatterns(),
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development"
  }
};

export default nextConfig;
