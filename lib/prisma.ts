import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const isRealDatabaseConfigured = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes('ep-sample-pooler') || url.includes('user:password')) {
    return false;
  }
  return true;
};

export const isDbConfigured = isRealDatabaseConfigured();

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
