import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Isso força o uso da engine de biblioteca em vez da engine de borda
    // @ts-ignore
    __internal: { engineType: 'library' } 
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma