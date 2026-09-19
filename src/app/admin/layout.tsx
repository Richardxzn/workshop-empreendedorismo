import type { Metadata } from "next";

// Área restrita: não deve aparecer em buscadores
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
