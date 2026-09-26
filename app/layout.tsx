import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "ระบบหลังบ้านร้านมาม่า | Mama Shop Back-Office",
  description: "ระบบติดตามยอดขายและเงินลงทุนร้านอาหารขนาดเล็ก ใช้งานง่ายบนมือถือ",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ร้านมาม่า",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6 pb-24 md:pb-12">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
