import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convergia — Motor determinista de decisiones multi-stakeholder",
  description: "Simulador determinista de negociación para decisiones industriales con múltiples stakeholders. Scoring ponderado, vetos, conflictos, concesiones y narrativa explicativa — sin IA, sin azar, solo lógica verificable.",
  keywords: ["simulador", "decisiones", "multi-stakeholder", "determinista", "negociación", "ingeniería industrial"],
  authors: [{ name: "Convergia" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f7f8fa]">{children}</body>
    </html>
  );
}
