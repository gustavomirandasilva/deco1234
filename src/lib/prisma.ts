import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
  pgPool?: Pool
}

/** Pooler Supabase (porta 6543) exige pgbouncer=true para o Prisma. */
function normalizeDatabaseUrl(url: string): string {
  const isSupabasePooler =
    url.includes('pooler.supabase.com') || url.includes(':6543')
  if (isSupabasePooler && !url.includes('pgbouncer=true')) {
    return `${url}${url.includes('?') ? '&' : '?'}pgbouncer=true`
  }
  return url
}

function createPrismaClient(): PrismaClient {
  let connectionString = process.env.DATABASE_URL?.trim()
  if (!connectionString) {
    const hint =
      process.env.VERCEL === '1'
        ? 'Configure DATABASE_URL em Vercel → Project → Settings → Environment Variables (Production e Preview). Use a URI do Supabase em modo Transaction pooler (porta 6543).'
        : 'Defina DATABASE_URL no arquivo .env (Supabase → Connect → Prisma).'
    throw new Error(`DATABASE_URL não está definida. ${hint}`)
  }

  connectionString = normalizeDatabaseUrl(connectionString)

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 20_000,
    })
  globalForPrisma.pgPool = pool

  pool.on('error', (err) => {
    console.error('[prisma] erro no pool pg:', err)
  })

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

function getPrisma(): PrismaClient {
  return globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient())
}

/**
 * Cliente lazy: só conecta no primeiro acesso (model.$call).
 * Evita falhar o `next build` só por importar este módulo sem DATABASE_URL.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      return undefined
    }
    const client = getPrisma()
    const value = Reflect.get(client, prop, receiver) as unknown
    if (typeof value === 'function') {
      return (value as (...a: unknown[]) => unknown).bind(client)
    }
    return value
  },
})
