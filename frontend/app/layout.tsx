import type { Metadata } from "next";
import { Literata, Manrope, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aethelgard - JRPG",
  description: "Un jeu de rôle au tour par tour immersif alimenté par Spring Boot et Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${literata.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f6fafd] text-[#171c1f]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
