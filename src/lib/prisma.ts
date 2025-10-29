import path from "path";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const fallbackDatabasePath = path.join(process.cwd(), "prisma/dev.db").replace(/\\/g, "/");
const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0
  ? process.env.DATABASE_URL
  : `file:${fallbackDatabasePath}`;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0) {
  process.env.DATABASE_URL = databaseUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
