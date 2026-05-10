/** Número só dígitos, com DDI (ex.: 5511999999999). */
const DEFAULT_WA = "5511999999999";

export function getWhatsAppNumber(): string {
  const n = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  return n && n.length >= 10 ? n : DEFAULT_WA;
}

export function buildWhatsAppLink(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
}
