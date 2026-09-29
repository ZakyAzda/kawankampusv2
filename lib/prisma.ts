import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Wraps a Prisma operation with one automatic retry on connection/IO errors */
export async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (err: any) {
    const msg: string = err?.message ?? "";
    const isConnError =
      msg.includes("I/O error") ||
      msg.includes("InternalError") ||
      msg.includes("connection") ||
      msg.includes("remote host") ||
      msg.includes("ECONNRESET");

    if (isConnError) {
      console.warn("[prisma] Connection error, reconnecting and retrying...", msg);
      await prisma.$connect();
      return await operation();
    }
    throw err;
  }
}

export default prisma;
