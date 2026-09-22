import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { shiftFilter, unauthorized } from "@/lib/http";
import { formatCpf } from "@/lib/cpf";
import { SHIFT_LABEL } from "@/lib/constants";

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
  timeZone: "America/Sao_Paulo",
});

// Escapa aspas e neutraliza "injeção de fórmula" no Excel (=, +, -, @)
function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

// GET /api/participants/export?shift=...  (ADMIN) -> baixa CSV
export async function GET(req: NextRequest) {
  if (!(await getSession())) return unauthorized();

  const filter = shiftFilter(req.nextUrl.searchParams);
  if (!filter.ok) {
    return NextResponse.json({ error: "Turno inválido" }, { status: 400 });
  }

  const rows = await prisma.participant.findMany({
    where: filter.shift ? { shift: filter.shift } : {},
    orderBy: { createdAt: "asc" },
  });

  const lines = [
    ["Nome", "CPF", "Turno", "Data/Hora da inscrição"],
    ...rows.map((p) => [
      p.name,
      formatCpf(p.cpf),
      SHIFT_LABEL[p.shift],
      dateFmt.format(p.createdAt),
    ]),
  ];

  // BOM (\uFEFF) + separador ";" para abrir com acentos corretos no Excel pt-BR
  const csv = "\uFEFF" + lines.map((l) => l.map(csvCell).join(";")).join("\r\n");
  const suffix = filter.shift ? `-${filter.shift.toLowerCase()}` : "";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscritos${suffix}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
