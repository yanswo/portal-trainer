import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { 
      name, 
      email, 
      password,
      cpf,
      phone,
      birthdate,
      address,
      city,
      state,
      zipCode
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Informe um e-mail e uma senha válidos." },
        { status: 400 }
      );
    }

    if (!name || !cpf || !phone) {
      return NextResponse.json(
        { success: false, message: "Nome completo, CPF e telefone são obrigatórios." },
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

    // Check if CPF already exists
    if (cpf) {
      const existingCPF = await prisma.user.findUnique({
        where: { cpf: String(cpf) },
      });

      if (existingCPF) {
        return NextResponse.json(
          {
            success: false,
            message: "Já existe uma conta cadastrada com esse CPF.",
          },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await hashPassword(String(password));

    const user = await prisma.user.create({
      data: {
        name: name ? String(name) : null,
        email: normalizedEmail,
        password: hashedPassword,
        cpf: cpf ? String(cpf) : null,
        phone: phone ? String(phone) : null,
        birthdate: birthdate ? new Date(birthdate) : null,
        address: address ? String(address) : null,
        city: city ? String(city) : null,
        state: state ? String(state) : null,
        zipCode: zipCode ? String(zipCode) : null,
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
