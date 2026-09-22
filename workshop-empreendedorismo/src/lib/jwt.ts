// Parte da sessão que roda também no middleware (Edge): só assina/verifica o token.
import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "workshop_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET ausente ou curto demais (mínimo 32 caracteres)");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(userId: number) {
  return new SignJWT({})
    .setSubject(String(userId))
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .sign(getKey());
}

export async function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}
