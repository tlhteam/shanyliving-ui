import type { Metadata } from "next";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var raw=localStorage.getItem("shany-customer-commerce");var saved=raw?JSON.parse(raw):null;var theme=saved&&saved.state?saved.state.theme:null;var system=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var next=theme&&theme!=="system"?theme:system;document.documentElement.classList.toggle("dark",next==="dark");document.documentElement.style.colorScheme=next;}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
