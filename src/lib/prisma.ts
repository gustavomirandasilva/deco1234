import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const url = process.env.DATABASE_URL

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: url,
  } as any) // O 'as any' resolve o erro de 'never' do TypeScript

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma