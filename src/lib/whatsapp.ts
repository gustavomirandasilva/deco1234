// src/lib/whatsapp.ts

/** Apenas dígitos com DDI (ex.: 5531998859556). */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5531998859556";

/** Link wa.me com texto (usa Checkout + botão flutuante). */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppMessage(cartItems: any[], total: number) {
  // Cabeçalho da mensagem
  let message = `*✨ NOVO PEDIDO - DECO IMPORTS ✨*\n`;
  message += `------------------------------------------\n\n`;
  
  // Listagem dos produtos
  cartItems.forEach((item) => {
    const subtotal = item.price * item.quantity;
    message += `🛍️ *${item.quantity}x ${item.name}*\n`;
    message += `💰 R$ ${item.price.toFixed(2)} cada (Subtotal: R$ ${subtotal.toFixed(2)})\n\n`;
  });

  message += `------------------------------------------\n`;
  message += `✅ *TOTAL DO PEDIDO: R$ ${total.toFixed(2)}*\n\n`;
  message += `_Olá, Deco! Vi esses produtos no catálogo e gostaria de finalizar a compra. Como podemos combinar a entrega?_`;

  return buildWhatsAppLink(message);
}