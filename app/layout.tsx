import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PC PARTS | ร้านจำหน่ายอุปกรณ์คอมพิวเตอร์และชิ้นส่วนพีซี",
  description:
    "ศูนย์รวมอุปกรณ์คอมพิวเตอร์ชั้นนำ ซีพียู การ์ดจอ แรม เมนบอร์ด เอสเอสดี พาวเวอร์ซัพพลาย และเกมมิ่งเกียร์ของแท้ประกันศูนย์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 font-sans transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
