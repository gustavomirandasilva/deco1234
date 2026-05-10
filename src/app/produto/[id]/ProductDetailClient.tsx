"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiTruck } from "react-icons/fi";
import { parseProductImages } from "@/lib/parse-product-images";

type Product = {
  id: string;
  name: string;
  description: string;
  historyOrigin?: string | null;
  price: number;
  stock: number;
  images: string;
  category: {
    id: string;
    name: string;
  };
};

const placeholderImage = "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop";

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const images = parseProductImages(product.images);

  const [mainImage, setMainImage] = useState(images.length > 0 ? images[0] : placeholderImage);

  const handleAddToCart = () => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
    const currentCart = stored ? JSON.parse(stored) : [];
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: mainImage,
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`Produto adicionado à sacola: ${product.name}`);
  };

  const handleBuyNow = () => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
    const currentCart = stored ? JSON.parse(stored) : [];
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: mainImage,
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cartUpdated'));
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Galeria de Fotos */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-gray-100 overflow-hidden transition-transform duration-500 hover:scale-105">
            <Image src={mainImage} alt={product.name} fill className="object-cover" />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMainImage(img)}
                  className={`relative aspect-square border-2 overflow-hidden ${mainImage === img ? "border-black" : "border-transparent"}`}
                >
                  <div className="h-full w-full transition-transform duration-500 hover:scale-105">
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações e Compra */}
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest font-playfair mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-2">Categoria: {product.category.name}</p>
          <p className="text-gray-500 mb-6">Eau de Parfum - 100ml</p>

          <div className="mb-6">
            <p className="text-3xl font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</p>
            <p className="text-sm text-gray-500 mt-1">ou 6x de R$ {(product.price / 6).toFixed(2).replace('.', ',')} sem juros</p>
          </div>

          <div className="prose text-gray-700 text-sm mb-6 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="border-l-2 border-black pl-4 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-2">História e Origem</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              {product.historyOrigin?.trim() ? product.historyOrigin : "[Espaço reservado para adicionar a história do perfume, sua inspiração, notas de topo, corpo e fundo, e a herança da marca.]"}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors"
            >
              Adicionar à Sacola
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full border-2 border-black text-black font-bold uppercase tracking-widest py-4 hover:bg-black hover:text-white transition-colors"
            >
              Pedir pelo WhatsApp
            </button>
          </div>

          {/* Cálculo de Frete */}
          <div className="border-t pt-8 mt-8">
            <div className="flex items-center space-x-2 text-gray-900 font-bold uppercase tracking-wide mb-4 text-sm">
              <FiTruck className="h-5 w-5" />
              <span>Calcular Frete e Prazo</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="00000-000"
                maxLength={9}
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm text-black bg-white focus:border-black focus:ring-black placeholder-gray-400"
              />
              <button type="button" className="bg-gray-800 text-white px-6 font-bold uppercase text-xs hover:bg-black">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
