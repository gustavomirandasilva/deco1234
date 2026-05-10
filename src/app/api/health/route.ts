import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/health — confirma se o Postgres (Prisma) responde. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "up" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    const needsUrl = msg.includes("DATABASE_URL");
    const needsSchema = msg.includes("does not exist") || msg.includes("P20");
    return NextResponse.json(
      {
        ok: false,
        database: "down",
        hint: needsUrl
          ? "Defina DATABASE_URL no projeto Vercel (Settings → Environment Variables), usando a URI do pooler Supabase (porta 6543, com pgbouncer)."
          : needsSchema
            ? "O banco existe mas o schema pode estar desatualizado. Rode: npx prisma db push"
            : "Veja os logs da função na Vercel (Runtime Logs).",
        ...(process.env.NODE_ENV !== "production" ? { detail: msg } : {}),
      },
      { status: 503 },
    );
  }
}
