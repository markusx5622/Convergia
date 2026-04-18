import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convergia — Simulador de decisiones multi-stakeholder",
  description: "Motor determinista de negociación para decisiones industriales con múltiples stakeholders, conflictos y concesiones.",
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
