import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Autenticação necessária" }, { status: 401 });
    }

    // Buscar a configuração de pagamento ativa
    const paymentConfig = await prisma.paymentConfig.findFirst({
      where: { gatewayAtivo: { not: undefined } }, // Assumindo que há apenas uma configuração ativa
    });

    if (!paymentConfig) {
      return NextResponse.json({ error: "Configuração de pagamento não encontrada" }, { status: 500 });
    }

    const { items, shippingAddress } = await request.json();

    // Calcular total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json({ error: `Produto ${item.productId} não encontrado` }, { status: 400 });
      }
      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Buscar userId pelo email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Criar o pedido
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        shipping: 0, // Calcular frete se necessário
        items: {
          create: orderItems,
        },
      },
    });

    // Lógica de integração com gateway
    switch (paymentConfig.gatewayAtivo) {
      case "PAGSEGURO":
        // Integração com PagSeguro
        // Usar paymentConfig.pagseguroEmail e pagseguroToken
        // Implementar chamada para API do PagSeguro
        // Exemplo: const response = await fetch('https://ws.pagseguro.uol.com.br/v2/checkout', { ... });
        // Retornar link de pagamento ou dados necessários
        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentUrl: "https://pagseguro.com/checkout/" + order.id, // Placeholder
        });

      case "STRIPE":
        // Integração com Stripe
        // Usar paymentConfig.stripeSecretKey
        // Implementar Stripe checkout
        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentUrl: "https://stripe.com/checkout/" + order.id, // Placeholder
        });

      case "MERCADOPAGO":
        // Integração com Mercado Pago
        // Usar paymentConfig.mercadopagoKey
        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentUrl: "https://mercadopago.com/checkout/" + order.id, // Placeholder
        });

      default:
        return NextResponse.json({ error: "Gateway não suportado" }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro no checkout:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}