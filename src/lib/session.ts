// Sessão do admin em cookie httpOnly (usar apenas em Route Handlers / Server Components).
import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_MAX_AGE, signToken, verifyToken } from "./jwt";

export async function createSession(userId: number) {
  const token = await signToken(userId);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

// Retorna o payload do token se houver sessão válida, senão null
export async function getSession() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE_NAME)?.value);
}
