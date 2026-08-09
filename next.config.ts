import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const productionHosts = ["shanyliving.com", "www.shanyliving.com", "api.shanyliving.com"];
const publicPaths = ["/storage/**", "/uploads/**"];

const productionImagePatterns = productionHosts.flatMap((hostname) =>
  publicPaths.map((pathname) => ({ protocol: "https" as const, hostname, pathname }))
);

function apiImagePatterns() {
  if (!apiOrigin) {
    return productionImagePatterns;
  }

  try {
    const { protocol, hostname, port } = new URL(apiOrigin);

    return [
      ...publicPaths.map((pathname) => ({
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname
      })),
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
