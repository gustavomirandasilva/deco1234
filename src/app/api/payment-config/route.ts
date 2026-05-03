import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Autenticação necessária" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const data = await request.json();

    // Deletar configuração anterior se existir
    await prisma.paymentConfig.deleteMany();

    // Criar nova configuração
    const config = await prisma.paymentConfig.create({
      data: {
        gatewayAtivo: data.gatewayAtivo,
        pagseguroEmail: data.pagseguroEmail,
        pagseguroToken: data.pagseguroToken,
        stripeSecretKey: data.stripeSecretKey,
        stripePublicKey: data.stripePublicKey,
        mercadopagoKey: data.mercadopagoKey,
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Erro salvando configuração:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const config = await prisma.paymentConfig.findFirst();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Erro buscando configuração:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}