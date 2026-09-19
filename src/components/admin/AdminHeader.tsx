"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/client-api";
import { btnOutline } from "@/components/ui";

const LINKS = [
  { href: "/admin", label: "Inscritos" },
  { href: "/admin/avisos", label: "Avisos" },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b-2 border-tinta bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4">
        <p className="font-display text-lg font-bold">Painel do organizador</p>

        <nav aria-label="Seções do painel" className="flex gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-1.5 font-display font-bold ${
                  active ? "bg-marca" : "hover:bg-linha/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/" className="font-bold underline underline-offset-4">
            Ver o site
          </Link>
          <button type="button" onClick={logout} disabled={leaving} className={btnOutline}>
            {leaving ? "Saindo…" : "Sair"}
          </button>
        </div>
      </div>
    </header>
  );
}
