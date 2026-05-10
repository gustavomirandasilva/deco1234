import 'dotenv/config'
import { defineConfig } from '@prisma/config'

/**
 * Prisma 7: a connection string do CLI (migrate, db push, introspect) fica aqui, não no schema.
 * `import 'dotenv/config'` garante que `.env` na raiz seja lido antes de ler process.env
 * (sem isso o CLI caía no fallback 127.0.0.1 quando o shell não exportava as variáveis).
 *
 * Preferir DIRECT_URL (Supabase porta 5432) para db push; senão DATABASE_URL.
 * O app em runtime usa DATABASE_URL em `src/lib/prisma.ts` (ex.: pooler 6543).
 */
const databaseUrl =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  'postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
})
