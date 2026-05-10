import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "product-images";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user?.email || role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Upload não configurado. No Supabase: crie o bucket público \"product-images\" e defina SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente (Vercel).",
      },
      { status: 501 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Máximo 5 MB por imagem" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^\w.\-]/g, "_") || "image";
  const path = `products/${Date.now()}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });

  if (upErr) {
    console.error("[upload]", upErr);
    return NextResponse.json(
      { error: `Falha no Storage: ${upErr.message}. Confira o bucket "${BUCKET}" e políticas.` },
      { status: 500 },
    );
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl });
}
