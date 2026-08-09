import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const productionImagePatterns = [
  { protocol: "https" as const, hostname: "shanyliving.com", pathname: "/storage/**" },
  { protocol: "https" as const, hostname: "www.shanyliving.com", pathname: "/storage/**" },
  { protocol: "https" as const, hostname: "api.shanyliving.com", pathname: "/storage/**" }
];

function apiImagePatterns() {
  if (!apiOrigin) {
    return productionImagePatterns;
  }

  try {
    const { protocol, hostname, port } = new URL(apiOrigin);

    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/storage/**"
      },
      ...productionImagePatterns
    ];
  } catch {
    return productionImagePatterns;
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiImagePatterns(),
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development"
  }
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
