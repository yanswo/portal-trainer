import { NextResponse } from "next/server";

import { createSessionToken, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, remember } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Informe e-mail e senha para continuar." },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Não encontramos uma conta com esse e-mail." },
        { status: 401 },
      );
    }

    const isLegacyPassword = !user.password.includes(":");
    const isValidPassword = await verifyPassword(String(password), user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Senha incorreta. Verifique e tente novamente." },
        { status: 401 },
      );
    }

    if (isLegacyPassword) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(String(password)) },
      });
    }

    const rememberDevice = Boolean(remember);
    const sessionPayload = createSessionToken(user.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "clientAuth",
      value: sessionPayload,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: rememberDevice ? 60 * 60 * 24 * 30 : 60 * 60 * 6,
    });

    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { success: false, message: "Erro inesperado ao fazer login. Tente novamente." },
      { status: 500 },
    );
  }
}
