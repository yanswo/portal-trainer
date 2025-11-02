import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getApiUser() {
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get("clientAuth");

  if (!authCookie) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Não autorizado" }),
      { status: 401 }
    );
  }

  try {
    const sessionPayload = JSON.parse(
      Buffer.from(authCookie.value, "base64").toString("utf-8")
    );
    const userId = sessionPayload.userId;
    if (!userId) throw new Error("Payload de sessão inválido");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) throw new Error("Usuário não encontrado");
    return user;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Sessão inválida" }),
      { status: 401 }
    );
  }
}

export async function GET() {
  const userOrResponse = await getApiUser();

  if (userOrResponse instanceof NextResponse) {
    return userOrResponse;
  }

  const user = userOrResponse;

  try {
    const budgets = await prisma.budgetRequest.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        courseFocus: true,
        seats: true,
        proposedFee: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}
