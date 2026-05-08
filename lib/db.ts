import prismaClientPkg from "@prisma/client";
import type { PrismaClient as PrismaClientType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = prismaClientPkg as unknown as {
  PrismaClient: new (...args: unknown[]) => PrismaClientType;
};
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType };

export const prisma: PrismaClientType =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
