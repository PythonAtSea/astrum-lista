import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Heart } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astrum Lista",
  description: "Made by @pythonatsea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="border-b border-border p-6 text-3xl font-bold">
          <Link href="/">Astrum Lista</Link>
        </header>
        <main className="grow p-6">{children}</main>
        <footer className="border-t border-border p-6">
          made with{" "}
          <Heart className="inline-block animate-pulse stroke-red-600 p-1" /> by{" "}
          <Link
            href="https://github.com/pythonatsea"
            className="text-blue-500 hover:underline"
          >
            @pythonatsea
          </Link>
        </footer>
      </body>
    </html>
  );
}
