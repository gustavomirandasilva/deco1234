"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = () => {
    try {
      const raw = localStorage.getItem("cartItems");
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    refresh();
    window.addEventListener("cartUpdated", refresh);
    return () => window.removeEventListener("cartUpdated", refresh);
  }, []);

  const updateQty = (id: string, delta: number) => {
    const next = items
      .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
      .filter((i) => i.quantity > 0);
    localStorage.setItem("cartItems", JSON.stringify(next));
    window.dispatchEvent(new Event("cartUpdated"));
    setItems(next);
  };

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(next));
    window.dispatchEvent(new Event("cartUpdated"));
    setItems(next);
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 font-playfair text-3xl font-bold uppercase tracking-widest">Sacola</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">
          Nenhum item.{" "}
          <Link href="/produtos" className="font-medium text-black underline">
            Ver catálogo
          </Link>
        </p>
      ) : (
        <>
          <ul className="mb-8 divide-y border bg-white">
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 bg-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt="" fill className="object-cover" unoptimized />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/produto/${item.id}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500">R$ {item.price.toFixed(2).replace(".", ",")} un.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="h-8 w-8 border text-sm hover:bg-gray-50"
                      aria-label="Menos"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="h-8 w-8 border text-sm hover:bg-gray-50"
                      aria-label="Mais"
                    >
                      +
                    </button>
                    <button type="button" onClick={() => remove(item.id)} className="ml-2 text-xs text-red-600">
                      Remover
                    </button>
                  </div>
                </div>
                <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
              </li>
            ))}
          </ul>

          <div className="mb-6 flex justify-between border-t pt-4">
            <span className="font-bold uppercase">Subtotal</span>
            <span className="text-xl font-bold">R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-black py-4 text-center text-sm font-bold uppercase tracking-widest text-white hover:bg-gray-800"
          >
            Pedir pelo WhatsApp
          </Link>
        </>
      )}
    </div>
  );
}
