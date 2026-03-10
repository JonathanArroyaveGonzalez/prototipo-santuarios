import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { LayoutContent } from "@/components/layout/LayoutContent";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Santuarios de la Memoria | Samaná, Caldas",
  description: "Diálogos para la verdad y la reparación simbólica de las víctimas de desaparición en Samaná, Caldas. Proyecto PRY-335 Universidad de Caldas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${sora.variable} ${fraunces.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}
