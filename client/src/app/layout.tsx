import type { Metadata } from "next";
import { Nunito, Noto_Sans_Malayalam } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "Pragya - Career Ecosystem",
  description: "India's Pioneer Youth-Developed Career Ecosystem.",
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
          <Navbar />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
