import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { SimTicker } from "@/components/sim-ticker";

const sans = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TraceGraph AI Control Room",
  description: "Giám sát chuỗi dữ liệu sản xuất thời gian thực & dự đoán lan truyền tác động sự cố — DENSO Factory Hacks 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <SimTicker />
        <AppHeader />
        <main className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">{children}</main>
      </body>
    </html>
  );
}
