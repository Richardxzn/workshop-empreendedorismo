import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

// Protege as PÁGINAS /admin. As rotas de API se protegem sozinhas (getSession).
export async function middleware(req: NextRequest) {
  const session = await verifyToken(req.cookies.get(COOKIE_NAME)?.value);
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isLoginPage) {
    return session
      ? NextResponse.redirect(new URL("/admin", req.url))
      : NextResponse.next();
  }

  if (!session) return NextResponse.redirect(new URL("/admin/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
