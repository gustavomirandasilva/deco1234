import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { parseProductImages } from "@/lib/parse-product-images";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch featured products (limit to 4 for the grid)
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full bg-black text-white flex items-center justify-center overflow-hidden">
        {/* Usando uma imagem elegante de perfume via Unsplash como placeholder */}
        <div className="absolute inset-0 opacity-60">
          <Image
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop"
            alt="Perfumes de luxo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-6 font-playfair drop-shadow-lg">
            A Essência do Luxo
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light tracking-wide text-gray-200">
            Descubra o melhor do Luxo Oriental e das Grandes Grifes em uma única vitrine.
          </p>
          <Link
            href="/categoria/luxo-oriental"
            className="inline-block bg-white text-black px-10 py-4 uppercase text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors"
          >
            Explorar Coleção
          </Link>
        </div>
      </section>

      {/* Destaques (Features) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-12 font-playfair">Mais Vendidos</h2>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum produto cadastrado ainda.</p>
              <Link href="/admin/produtos" className="inline-block mt-4 bg-black text-white px-6 py-3 uppercase text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors">
                Cadastrar Produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => {
                const images = parseProductImages(product.images);
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
                      {/* Badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold uppercase px-2 py-1 z-10">
                          Top 1
                        </div>
                      )}
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

          <div className="mt-12">
            <Link href="/produtos" className="inline-block border-2 border-black text-black px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Secundário */}
      <section className="py-24 bg-gray-50 border-t">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-6 font-playfair">Exclusividade Árabe e Europeia</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Mergulhe nas notas intensas e marcantes do Oriente Médio e na sofisticação clássica da Europa. Os perfumes da Deco Imports trazem a combinação perfeita entre fixação extrema, projeção marcante e ingredientes raros das melhores casas de perfumaria do mundo.
          </p>
          <Link href="/produtos" className="inline-block bg-black text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors">
            Descubra a Coleção
          </Link>
        </div>
      </section>
    </div>
  );
}
