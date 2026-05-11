/**
 * Promove um usuário a ADMIN no banco (mesmo schema do Prisma).
 * Uso (na pasta do projeto, com .env carregado):
 *   node scripts/promote-admin.mjs seu@email.com
 *
 * Ou com DATABASE_URL inline:
 *   set DATABASE_URL=postgresql://... && node scripts/promote-admin.mjs seu@email.com
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const email = process.argv[2]?.trim()
if (!email) {
  console.error('Uso: node scripts/promote-admin.mjs seu@email.com')
  process.exit(1)
}

const url = process.env.DATABASE_URL?.trim()
if (!url) {
  console.error('Defina DATABASE_URL no .env ou no ambiente.')
  process.exit(1)
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
})

try {
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  })
  console.log('OK — usuário agora é ADMIN:', user.email)
} catch (e) {
  console.error('Erro:', e.message)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
