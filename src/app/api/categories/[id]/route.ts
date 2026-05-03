import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const defaultCategories = ["Luxo Oriental", "Grandes Grifes"];

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const json = await request.json();

    const existingCategory = await prisma.category.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
    }

    if (defaultCategories.includes(existingCategory.name) && json.name !== existingCategory.name) {
      return NextResponse.json({ error: "Categoria padrão não pode ter o nome alterado." }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: resolvedParams.id },
      data: {
        name: json.name,
        description: json.description,
        isActive: json.isActive,
      }
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const existingCategory = await prisma.category.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
    }

    if (defaultCategories.includes(existingCategory.name)) {
      return NextResponse.json({ error: "Categoria padrão não pode ser excluída." }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
