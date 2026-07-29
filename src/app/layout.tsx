import type { Metadata } from "next";
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
