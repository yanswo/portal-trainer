import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

async function getApiUser() {
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get("clientAuth");
  if (!authCookie) throw new Error("Não autorizado");

  const sessionPayload = JSON.parse(
    Buffer.from(authCookie.value, "base64").toString("utf-8")
  );
  const userId = sessionPayload.userId;
  if (!userId) throw new Error("Sessão inválida");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuário não encontrado");

  return user;
}

export async function POST(request: Request) {
  try {
    const user = await getApiUser();
    const body = await request.json();
    const { courseId, paymentMethod, amount } = body;

    if (!courseId || !paymentMethod || !amount) {
      return NextResponse.json(
        { success: false, message: "Dados da requisição incompletos." },
        { status: 400 }
      );
    }

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Método de pagamento inválido." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Curso não encontrado." },
        { status: 404 }
      );
    }

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: courseId },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, message: "Você já está matriculado neste curso." },
        { status: 409 }
      );
    }

    const { newEnrollment } = await prisma.$transaction(async (tx) => {
      const newEnrollment = await tx.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          progress: 0.0,
        },
      });

      await tx.payment.create({
        data: {
          amount: amount,
          status: PaymentStatus.CONFIRMED,
          method: paymentMethod as PaymentMethod,
          reference: `MOCK-${newEnrollment.id}`,
          userId: user.id,
          courseId: course.id,
          enrollmentId: newEnrollment.id,
        },
      });

      return { newEnrollment };
    });

    return NextResponse.json(
      { success: true, enrollmentId: newEnrollment.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no mock-purchase:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json(
      { success: false, message: message },
      { status: 500 }
    );
  }
}
