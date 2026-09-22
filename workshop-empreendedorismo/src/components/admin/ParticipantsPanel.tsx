"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api";
import { SHIFT_LABEL, type ShiftValue } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import type { Counts, ParticipantRow } from "@/lib/types";
import { btnOutline } from "@/components/ui";

type Filter = "TODOS" | ShiftValue;

// Os totais funcionam também como filtro da lista
const SEGMENTS: { value: Filter; label: string; key: keyof Counts }[] = [
  { value: "TODOS", label: "Total geral", key: "total" },
  { value: "MANHA", label: "Total manhã", key: "MANHA" },
  { value: "NOITE", label: "Total tarde", key: "NOITE" },
  { value: "AMBOS", label: "Total ambos", key: "AMBOS" },
];

export default function ParticipantsPanel() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("TODOS");
  const [counts, setCounts] = useState<Counts | null>(null);
  const [rows, setRows] = useState<ParticipantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    (async () => {
      const res = await apiFetch<{ counts: Counts; participants: ParticipantRow[] }>(
        `/api/participants?shift=${filter}`,
        { signal: controller.signal }
      );
      if (controller.signal.aborted) return;

      if (res.ok) {
        setCounts(res.data.counts);
        setRows(res.data.participants);
      } else if (res.status === 401) {
        router.replace("/admin/login");
        return;
      } else {
        setError(res.error);
      }
      setLoading(false);
    })();

    return () => controller.abort();
  }, [filter, reloadKey, router]);

  const emptyText =
    filter === "TODOS"
      ? "Ainda não há inscrições."
      : `Nenhuma inscrição no turno ${SHIFT_LABEL[filter].toLowerCase()}.`;

  return (
    <div>
      <p className="mt-2 text-tinta/80">Clique em um total para filtrar a lista por turno.</p>

      <div
        role="group"
        aria-label="Filtrar inscritos por turno"
        className="mt-5 grid grid-cols-2 gap-[2px] border-2 border-tinta bg-tinta md:grid-cols-4"
      >
        {SEGMENTS.map((s) => {
          const active = filter === s.value;
          return (
            <button
              key={s.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(s.value)}
              className={`px-4 py-4 text-left transition-colors ${
                active ? "bg-marca" : "bg-white hover:bg-linha/50"
              }`}
            >
              <span className="block text-sm font-bold">{s.label}</span>
              <span className="block font-display text-4xl font-bold tabular-nums">
                {counts ? counts[s.key] : "–"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-bold">
          {loading && rows.length === 0
            ? "Carregando…"
            : `Mostrando ${rows.length} ${rows.length === 1 ? "inscrito" : "inscritos"}`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={btnOutline}
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={loading}
          >
            Atualizar
          </button>
          <a
            href={`/api/participants/export?shift=${filter}`}
            download
            className={btnOutline}
          >
            Exportar CSV
          </a>
        </div>
      </div>

      {error ? (
        <div role="alert" className="mt-4 border-2 border-erro bg-white p-4">
          <p className="font-bold text-erro">{error}</p>
          <button
            type="button"
            className={`${btnOutline} mt-3`}
            onClick={() => setReloadKey((k) => k + 1)}
          >
            Tentar de novo
          </button>
        </div>
      ) : (
        <div
          aria-busy={loading}
          className={`mt-4 overflow-x-auto border-2 border-tinta bg-white ${
            loading ? "opacity-60" : ""
          }`}
        >
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <caption className="sr-only">Lista de inscritos</caption>
            <thead className="bg-linha/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-display font-bold">
                  Nome
                </th>
                <th scope="col" className="px-4 py-3 font-display font-bold">
                  CPF
                </th>
                <th scope="col" className="px-4 py-3 font-display font-bold">
                  Turno
                </th>
                <th scope="col" className="px-4 py-3 font-display font-bold">
                  Inscrito em
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="border-t-2 border-linha px-4 py-8 text-center">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id} className="border-t border-linha">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3 tabular-nums">{p.cpf}</td>
                    <td className="px-4 py-3">{SHIFT_LABEL[p.shift]}</td>
                    <td className="px-4 py-3 tabular-nums">{formatDateTime(p.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
