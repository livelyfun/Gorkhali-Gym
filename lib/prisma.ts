import type { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const isRealDatabaseConfigured = () => {
  if (typeof window !== 'undefined') return false; // Browser guard
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes('ep-sample-pooler') || url.includes('user:password')) {
    return false;
  }
  return true;
};

export const isDbConfigured = isRealDatabaseConfigured();

// Only instantiate PrismaClient on the server
function getPrismaClient(): PrismaClient {
  if (typeof window !== 'undefined') {
    throw new Error('PrismaClient cannot be used in browser context');
  }
   
  const { PrismaClient: PC } = require('@prisma/client');
  return globalThis.prisma || new PC({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

let _prisma: PrismaClient | null = null;

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!_prisma) {
      _prisma = getPrismaClient();
      if (process.env.NODE_ENV !== 'production') {
        globalThis.prisma = _prisma;
      }
    }
    return (_prisma as any)[prop];
  },
});

export default prisma;
