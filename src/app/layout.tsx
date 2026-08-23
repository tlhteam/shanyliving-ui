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

const themeScript = `(function(){try{var k='shany-theme',v=localStorage.getItem(k);if(v!=='light'&&v!=='dark'&&v!=='system'){var raw=localStorage.getItem('shany-customer-commerce');if(raw){var t=JSON.parse(raw);var s=t&&t.state&&t.state.theme;if(s==='light'||s==='dark'||s==='system'){v=s}}}if(!v){v='system'}var d=v==='dark'||(v==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={localeDirection(locale)} className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
        <Script
          src="https://shipazti.com/embed/shiputzai-storefront-v1.js"
          strategy="afterInteractive"
          data-store="shany-living"
          data-locale={locale}
          data-platform="auto"
        />
      </body>
    </html>
  );
}
