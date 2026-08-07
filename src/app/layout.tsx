import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Convergia — Motor determinista de decisiones multi-stakeholder",
  description:
    "Simulador determinista de negociación para decisiones industriales con múltiples stakeholders. Scoring ponderado, vetos, conflictos, concesiones y narrativa explicativa — sin IA, sin azar, solo lógica verificable.",
  keywords: [
    "simulador",
    "decisiones",
    "multi-stakeholder",
    "determinista",
    "negociación",
    "ingeniería industrial",
  ],
  authors: [{ name: "Convergia" }],
  icons: {
    icon: [
      { url: "/LogoConvergiasf.png" },
      { url: "/LogoConvergiasf.png", type: "image/png" },
    ],
    shortcut: "/LogoConvergiasf.png",
    apple: "/LogoConvergiasf.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/LogoConvergiasf.png" type="image/png" />
        <link rel="apple-touch-icon" href="/LogoConvergiasf.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f7f8fa] font-sans">
        {children}
      </body>
    </html>
  );
}
