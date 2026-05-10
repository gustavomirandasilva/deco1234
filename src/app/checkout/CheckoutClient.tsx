"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cartItems");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatOrderMessage(items: CartItem[]): string {
  const lines = items.map(
    (i) => `• ${i.quantity}x ${i.name} — R$ ${(i.price * i.quantity).toFixed(2).replace(".", ",")}`,
  );
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return [
    "Olá! Quero fechar um pedido na Deco Imports:",
    "",
    ...lines,
    "",
    `Total: R$ ${total.toFixed(2).replace(".", ",")}`,
    "",
    "Podem me orientar sobre pagamento e envio?",
  ].join("\n");
}

export default function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const waHref = useMemo(() => buildWhatsAppLink(formatOrderMessage(items)), [items]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-center font-playfair text-3xl font-bold uppercase tracking-widest">
        Finalizar pedido
      </h1>
      <p className="mb-8 text-center text-sm text-gray-600">
        Não processamos pagamento neste site. Envie seu pedido pelo WhatsApp e combinamos entrega e forma de
        pagamento diretamente com você.
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-gray-50 p-8 text-center">
          <p className="mb-4 text-gray-600">Sua sacola está vazia.</p>
          <Link
            href="/produtos"
            className="inline-block bg-black px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-gray-800"
          >
            Ver perfumes
          </Link>
        </div>
      ) : (
        <>
          <ul className="mb-8 divide-y rounded-xl border bg-white">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt="" fill className="object-cover" unoptimized />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <p className="shrink-0 font-bold">
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
              </li>
            ))}
          </ul>

          <div className="mb-8 flex items-center justify-between border-t pt-4">
            <span className="text-lg font-bold uppercase tracking-widest">Total</span>
            <span className="text-xl font-bold">R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center bg-green-600 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-green-700"
          >
            Enviar pedido no WhatsApp
          </a>

          <p className="mt-4 text-center text-xs text-gray-500">
            Você será redirecionado para o WhatsApp com a lista do pedido já preenchida.
          </p>
        </>
      )}

      <div className="mt-10 text-center">
        <Link href="/produtos" className="text-sm font-medium text-black underline">
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
