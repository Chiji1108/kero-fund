import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kero Fund – ケロちゃん bot 維持クラファン",
    template: "%s | Kero Fund",
  },
  description:
    "ケロちゃん bot のサーバー代 10 年分（60,000 円）をみんなで楽しく集めるジョーククラファン。削除されたメッセージを未来に残す応援サイトです。",
  keywords: [
    "ケロちゃん",
    "Discord",
    "クラウドファンディング",
    "ログ監視",
    "ボット運用",
    "Kero bot",
  ],
  authors: [{ name: "Kero Preservation Team" }],
  creator: "Kero Preservation Team",
  publisher: "Kero Preservation Team",
  applicationName: "Kero Fund",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kero Fund – ケロちゃん bot 維持クラファン",
    description:
      "ケロちゃん bot のサーバー代 10 年分（60,000 円）をみんなで楽しく集めるジョーククラファン。削除されたメッセージを未来に残す応援サイトです。",
    type: "website",
    siteName: "Kero Fund",
    locale: "ja_JP",
    images: [
      {
        url: "/kero.jpeg",
        width: 256,
        height: 256,
        alt: "ケロちゃん bot 維持クラファンのメインビジュアル",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kero Fund – ケロちゃん bot 維持クラファン",
    description:
      "ケロちゃん bot のサーバー代 10 年分（60,000 円）をみんなで楽しく集めるジョーククラファン。削除されたメッセージを未来に残す応援サイトです。",
    images: ["/kero.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
