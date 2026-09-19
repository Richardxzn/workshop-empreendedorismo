import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { shiftSchema } from "./validators";

export const unauthorized = () =>
  NextResponse.json({ error: "Não autorizado" }, { status: 401 });

// Transforma os erros do Zod em { campo: "mensagem" } para o formulário exibir
export function fieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// Lê ?shift=MANHA|NOITE|AMBOS (ausente ou "TODOS" = sem filtro)
export function shiftFilter(searchParams: URLSearchParams) {
  const raw = searchParams.get("shift");
  if (!raw || raw === "TODOS") return { ok: true as const, shift: undefined };
  const parsed = shiftSchema.safeParse(raw);
  return parsed.success
    ? { ok: true as const, shift: parsed.data }
    : { ok: false as const };
}
