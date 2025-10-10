import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVS Family Tree - அகில இந்திய வேளாளர் சங்கம்",
  description: "Connect with your roots, discover your heritage, and build lasting relationships within the AVS community. Preserve your family legacy for future generations.",
  keywords: ["AVS", "Family Tree", "Genealogy", "Tamil", "Vellalar", "Matrimony", "Heritage"],
  authors: [{ name: "AVS Family Tree Team" }],
  openGraph: {
    title: "AVS Family Tree - அகில இந்திய வேளாளர் சங்கம்",
    description: "Connect with your roots, discover your heritage, and build lasting relationships within the AVS community.",
    type: "website",
    locale: "en_US",
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
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
