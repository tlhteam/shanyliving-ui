import type { Metadata } from "next";
import { AppProviders } from "@/components/app/AppProviders";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
