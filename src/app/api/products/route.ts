import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');

  try {
    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    
    // Images are sent as an array of strings, Prisma schema expects a string.
    // We will JSON.stringify the array.
    const imagesStr = Array.isArray(json.images) ? JSON.stringify(json.images) : JSON.stringify([]);

    const product = await prisma.product.create({
      data: {
        name: json.name,
        description: json.description,
        historyOrigin: json.historyOrigin || null,
        price: parseFloat(json.price),
        stock: parseInt(json.stock),
        images: imagesStr,
        categoryId: json.categoryId,
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
