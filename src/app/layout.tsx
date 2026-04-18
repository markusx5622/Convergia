import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convergia — Simulador determinista de decisiones multi-stakeholder",
  description: "Motor determinista de negociación para decisiones industriales con múltiples stakeholders. Scoring ponderado, vetos, conflictos, concesiones y narrativa explicativa — sin IA, sin azar, solo lógica verificable.",
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
      <body className="min-h-full flex flex-col bg-[#f8fafc]">{children}</body>
    </html>
  );
}
