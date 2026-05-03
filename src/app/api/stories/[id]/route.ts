import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const json = await request.json();

    const story = await prisma.perfumeStory.update({
      where: { id: resolvedParams.id },
      data: {
        title: json.title,
        content: json.content,
        category: json.category,
        isActive: json.isActive,
      }
    });
    return NextResponse.json(story);
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.perfumeStory.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}