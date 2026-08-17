import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { AppProviders } from "@/components/app/AppProviders";
import { localeDirection } from "@/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHANY Living",
  description: "Premium customizable furniture in Tel Aviv",
  icons: {
    icon: "/shany_logo_black_ver2.png",
    shortcut: "/shany_logo_black_ver2.png",
    apple: "/shany_logo_black_ver2.png"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={localeDirection(locale)} className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
        <Script
          src="https://shipazti.com/embed/shiputzai-storefront-v1.js"
          strategy="afterInteractive"
          data-store="shany-living"
          data-locale="he"
          data-platform="auto"
        />
      </body>
    </html>
  );
}
