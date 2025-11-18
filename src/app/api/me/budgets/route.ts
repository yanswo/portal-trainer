import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { DemandType, CertificateFormat, BudgetStatus } from "@prisma/client";

async function getApiUser() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clientAuth");

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
        course: { select: { title: true, imageUrl: true } },
        seats: true,
        proposedFee: true,
        status: true,
        updatedAt: true,
        demandType: true,
        certificateFormat: true,
      },
    });

    const formattedBudgets = budgets.map((b) => ({
      ...b,
      courseFocus: b.course.title,
      courseImage: b.course.imageUrl,
    }));

    return NextResponse.json(formattedBudgets);
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userOrResponse = await getApiUser();

  if (userOrResponse instanceof NextResponse) {
    return userOrResponse;
  }
  const user = userOrResponse;

  try {
    const body = await request.json();
    const {
      courseId,
      seats,
      demandType,
      certificateFormat,
      notes,
      // companyName removido pois não existe mais no schema
    } = body;

    if (!courseId || !seats || !demandType || !certificateFormat) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos os campos obrigatórios devem ser preenchidos.",
        },
        { status: 400 }
      );
    }

    if (!Object.values(DemandType).includes(demandType)) {
      return NextResponse.json(
        { success: false, message: "Tipo de demanda inválido." },
        { status: 400 }
      );
    }

    if (!Object.values(CertificateFormat).includes(certificateFormat)) {
      return NextResponse.json(
        { success: false, message: "Formato de certificado inválido." },
        { status: 400 }
      );
    }

    const budget = await prisma.budgetRequest.create({
      data: {
        userId: user.id,
        courseId: String(courseId),
        seats: Number(seats),
        demandType: demandType as DemandType,
        certificateFormat: certificateFormat as CertificateFormat,
        notes: notes ? String(notes) : null,
        status: BudgetStatus.RECEIVED,
      },
    });

    return NextResponse.json({ success: true, budget }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Erro interno do servidor." }),
      { status: 500 }
    );
  }
}
