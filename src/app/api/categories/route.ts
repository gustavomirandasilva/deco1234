import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const defaultCategories = ["Luxo Oriental", "Grandes Grifes"];
const allowedAdditionalCategories = ["Maquiagem", "Acessórios"];
const allowedCategoryNames = [...defaultCategories, ...allowedAdditionalCategories];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const name = String(json.name || "").trim();
    const description = json.description ?? null;
    const isActive = json.isActive ?? true;

    if (!name) {
      return NextResponse.json({ error: "Nome da categoria é obrigatório." }, { status: 400 });
    }

    if (!allowedCategoryNames.includes(name)) {
      return NextResponse.json({ error: "Categoria não permitida. Use apenas Maquiagem ou Acessórios para categorias adicionais." }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        isActive,
      }
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Já existe uma categoria com esse nome." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}
