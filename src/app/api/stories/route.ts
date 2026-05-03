import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const activeOnly = searchParams.get('activeOnly') === 'true';

  try {
    const stories = await prisma.perfumeStory.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(activeOnly && { isActive: true })
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const story = await prisma.perfumeStory.create({
      data: {
        title: json.title,
        content: json.content,
        category: json.category,
        isActive: json.isActive ?? true,
      }
    });
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}