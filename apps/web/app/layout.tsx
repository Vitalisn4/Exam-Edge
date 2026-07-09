import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { PlausibleScript } from "@/components/layout/PlausibleScript";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/toast";
import { themeInitScript } from "@/lib/theme";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-family",
});

export const metadata: Metadata = {
  title: "ExamEdge — Master Every Subject. Ace Every Examination.",
  description:
    "AI-powered examination preparation for African secondary students. GCE, BEPC, WAEC, NECO, KCSE — examiner-accurate marking, personalised study plans, works offline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700,800&display=swap"
        />
      </head>
      <body className="min-h-screen font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
        <PlausibleScript />
      </body>
    </html>
  );
}
