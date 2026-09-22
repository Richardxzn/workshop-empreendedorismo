import { PrismaClient } from "@prisma/client";

// Reaproveita a conexão em desenvolvimento (hot reload cria várias instâncias)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
