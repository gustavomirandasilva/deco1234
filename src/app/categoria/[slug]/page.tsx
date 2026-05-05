import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  const slugToCategoryName: Record<string, string> = {
    "perfumes-arabes": "Luxo Oriental",
    "perfumes-europeus": "Grandes Grifes",
    "luxo-oriental": "Luxo Oriental",
    "grandes-grifes": "Grandes Grifes",
  };

  const categoryName = slugToCategoryName[slug] ?? slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const category = await prisma.category.findFirst({
    where: { name: { equals: categoryName } }
  });

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold uppercase tracking-widest font-playfair">Categoria não encontrada</h1>
        <p className="text-gray-500 mt-2">A categoria solicitada não existe.</p>
      </div>
    );
  }

  // Fetch products for this category
  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 border-b pb-4">
        <h1 className="text-4xl font-bold uppercase tracking-widest font-playfair">{category.name}</h1>
        <p className="text-gray-500 mt-2">Explore a nossa coleção exclusiva de {category.name.toLowerCase()}.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => {
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
