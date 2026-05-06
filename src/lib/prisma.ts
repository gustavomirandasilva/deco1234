import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Pegamos a URL e garantimos que ela é uma string
const url = process.env.DATABASE_URL

if (!url) {
  throw new Error('A variável de ambiente DATABASE_URL não foi definida!')
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: url,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma