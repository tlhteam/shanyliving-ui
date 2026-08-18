import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const productionHosts = [
  "shanyliving.com",
  "www.shanyliving.com",
  "api.shanyliving.com",
];

const publicPaths = ["/storage/**", "/uploads/**"];

const productionImagePatterns = productionHosts.flatMap((hostname) =>
  publicPaths.map((pathname) => ({
    protocol: "https" as const,
    hostname,
    pathname,
  }))
);

const googleAvatarPatterns = [
  {
    protocol: "https" as const,
    hostname: "lh3.googleusercontent.com",
    pathname: "/**",
  },
];

const developmentImagePatterns = ["localhost", "127.0.0.1"].flatMap((hostname) =>
  publicPaths.map((pathname) => ({
    protocol: "http" as const,
    hostname,
    port: "8000",
    pathname,
  }))
);

function apiImagePatterns() {
  const patterns = [
    ...productionImagePatterns,
    ...(process.env.NODE_ENV === "development"
      ? developmentImagePatterns
      : []),
  ];

  if (!apiOrigin) {
    return patterns;
  }

  try {
    const url = new URL(apiOrigin);

    const protocol = url.protocol.replace(":", "") as "http" | "https";

    const apiPatterns = publicPaths.map((pathname) => ({
      protocol,
      hostname: url.hostname,
      port: url.port,
      pathname,
    }));

    return [...apiPatterns, ...patterns];
  } catch {
    return patterns;
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [...apiImagePatterns(), ...googleAvatarPatterns],
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
