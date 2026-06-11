import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SurveyMetrics Pro | Universidad de San Pedro Sula",
  description: "Plataforma de gestión de encuestas y análisis de indicadores de satisfacción de la Universidad de San Pedro Sula (USAP).",
  keywords: ["USAP", "Encuestas", "Satisfacción", "Indicadores", "San Pedro Sula", "SurveyMetrics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FCFDFE] text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
