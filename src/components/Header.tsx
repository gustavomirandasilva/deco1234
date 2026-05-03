"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingBag, FiUser, FiSearch, FiMenu } from "react-icons/fi";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cartItems") : null;
    const cartItems = stored ? JSON.parse(stored) : [];
    const total = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    const handleCartUpdated = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white text-black shadow-sm">
      {/* Top Banner */}
      <div className="bg-black py-2 text-center text-xs text-white sm:text-sm">
        <p>Frete grátis nas compras acima de R$ 299,00. Aproveite!</p>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Mobile Menu */}
        <button className="lg:hidden" aria-label="Menu">
          <FiMenu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Deco Imports" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden text-2xl font-bold uppercase tracking-widest sm:block">
            Deco Imports
          </span>
        </Link>

        {/* Search */}
        <div className="hidden flex-1 px-8 lg:block max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar perfumes, marcas..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
            />
            <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <Link href="/login" className="flex flex-col items-center hover:text-gray-600 transition-colors">
            <FiUser className="h-6 w-6" />
            <span className="mt-1 hidden text-[10px] font-medium uppercase sm:block">Entrar</span>
          </Link>
          <Link href="/carrinho" className="flex flex-col items-center hover:text-gray-600 transition-colors">
            <div className="relative">
              <FiShoppingBag className="h-6 w-6" />
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </div>
            <span className="mt-1 hidden text-[10px] font-medium uppercase sm:block">Sacola</span>
          </Link>
        </div>
      </div>

      {/* Navigation (Categories) */}
      <nav className="hidden border-t bg-white lg:block">
        <ul className="container mx-auto flex justify-center space-x-12 py-3 text-sm font-semibold uppercase tracking-wide">
          <li><Link href="/categoria/luxo-oriental" className="hover:underline underline-offset-8">Luxo Oriental</Link></li>
          <li><Link href="/categoria/grandes-grifes" className="hover:underline underline-offset-8">Grandes Grifes</Link></li>
          <li><Link href="/categoria/lancamentos" className="hover:underline underline-offset-8 text-red-600">Lançamentos</Link></li>
          {/* Abaixo estarão as abas dinâmicas habilitadas pelo admin futuramente */}
          <li className="text-gray-400 cursor-not-allowed">Maquiagem</li>
          <li className="text-gray-400 cursor-not-allowed">Acessórios</li>
        </ul>
      </nav>
    </header>
  );
}
