import type { Metadata } from "next";
import { Nunito, Noto_Sans_Malayalam } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Providers } from "./providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam"],
});

const samarkan = localFont({
  src: '../../public/fonts/SAMARKAN.ttf',
  variable: '--font-samarkan',
});

export const metadata: Metadata = {
  title: "Pragya - Career Platform",
  description: "India's Pioneer Youth-Developed Career Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${notoMalayalam.variable} ${samarkan.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-[#014b3b] focus:font-bold focus:rounded-lg focus:shadow-lg"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
