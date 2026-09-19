import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { participantSchema } from "@/lib/validators";
import { fieldErrors, shiftFilter, unauthorized } from "@/lib/http";
import { formatCpf } from "@/lib/cpf";
import type { ShiftValue } from "@/lib/constants";

// POST /api/participants  (PÚBLICA) -> salva a inscrição
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = participantSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", fields: fieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const participant = await prisma.participant.create({
      data: parsed.data,
      // não devolve o CPF de volta para o navegador público
      select: { id: true, name: true, shift: true, createdAt: true },
    });
    return NextResponse.json({ participant }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        {
          error: "Este CPF já está inscrito",
          fields: { cpf: "Este CPF já está inscrito" },
        },
        { status: 409 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Erro interno ao salvar a inscrição" }, { status: 500 });
  }
}

// GET /api/participants?shift=MANHA|NOITE|AMBOS  (ADMIN) -> lista + contadores
export async function GET(req: NextRequest) {
  if (!(await getSession())) return unauthorized();

  const filter = shiftFilter(req.nextUrl.searchParams);
  if (!filter.ok) {
    return NextResponse.json({ error: "Turno inválido" }, { status: 400 });
  }

  const where: Prisma.ParticipantWhereInput = filter.shift ? { shift: filter.shift } : {};

  const [participants, grouped] = await Promise.all([
    prisma.participant.findMany({ where, orderBy: { createdAt: "desc" } }),
    // contadores sempre consideram TODOS os inscritos, independente do filtro
    prisma.participant.groupBy({ by: ["shift"], _count: { _all: true } }),
  ]);

  const counts: Record<"total" | ShiftValue, number> = {
    total: 0,
    MANHA: 0,
    NOITE: 0,
    AMBOS: 0,
  };
  for (const g of grouped) {
    counts[g.shift] = g._count._all;
    counts.total += g._count._all;
  }

  return NextResponse.json({
    counts,
    participants: participants.map((p) => ({
      id: p.id,
      name: p.name,
      cpf: formatCpf(p.cpf),
      shift: p.shift,
      createdAt: p.createdAt,
    })),
  });
}
