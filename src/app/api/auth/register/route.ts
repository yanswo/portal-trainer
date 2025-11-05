import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Informe um e-mail e uma senha válidos." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Já existe uma conta cadastrada com esse e-mail.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(String(password));

    const user = await prisma.user.create({
      data: {
        name: name ? String(name) : null,
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível concluir o cadastro. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
