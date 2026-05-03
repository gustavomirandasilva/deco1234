import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 border-b pb-4">
        <h1 className="text-4xl font-bold uppercase tracking-widest font-playfair">Todos os Produtos</h1>
        <p className="text-gray-500 mt-2">Explore nossa coleção completa de fragrâncias.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto cadastrado ainda.</p>
          <Link href="/admin/produtos" className="inline-block mt-4 bg-black text-white px-6 py-3 uppercase text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors">
            Cadastrar Produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const images = product.images ? JSON.parse(product.images) : [];
            const imageUrl = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop";

            return (
              <Link href={`/produto/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold uppercase tracking-wide group-hover:text-gray-600 transition-colors">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">Eau de Parfum - 100ml</p>
                  <p className="text-lg font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}