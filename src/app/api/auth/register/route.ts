import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, email, password, cpf, phone, cep, address, newsletter } = json;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha os campos obrigatórios." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este email já está em uso." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cpf,
        phone,
        cep,
        address,
        newsletter: newsletter || false,
        role: "USER",
      },
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Erro ao criar usuário." }, { status: 500 });
  }
}
