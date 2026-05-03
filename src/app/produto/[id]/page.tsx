import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

type ProductWithCategory = {
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

export default async function ProdutoDetalhes({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { category: true }
  }) as ProductWithCategory | null;

  if (!product) {
    notFound();
  }

  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    historyOrigin: product.historyOrigin ?? null,
    price: product.price,
    stock: product.stock,
    images: product.images,
    category: {
      id: product.category.id,
      name: product.category.name,
    },
  };

  return <ProductDetailClient product={productData} />;
}
