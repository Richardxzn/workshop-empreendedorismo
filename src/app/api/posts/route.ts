import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { postSchema } from "@/lib/validators";
import { fieldErrors, unauthorized } from "@/lib/http";

export const dynamic = "force-dynamic";

// GET /api/posts  (PÚBLICA) -> avisos, mais recentes primeiro
export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

// POST /api/posts  (ADMIN) -> publica um aviso
export async function POST(req: Request) {
  if (!(await getSession())) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", fields: fieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({ data: parsed.data });
  return NextResponse.json({ post }, { status: 201 });
}
