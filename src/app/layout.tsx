import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Workshop de Empreendedorismo",
    template: "%s | Workshop de Empreendedorismo",
  },
  description:
    "Inscreva-se no Workshop de Empreendedorismo da escola e acompanhe os avisos do evento.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
