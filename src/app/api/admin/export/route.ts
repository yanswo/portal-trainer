import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "clients";

  if (type === "payments") {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    const rows = [
      ["Data", "Aluno", "Email", "Valor (R$)", "Status"],
      ...payments.map((p) => [
        new Date(p.createdAt).toLocaleDateString("pt-BR"),
        p.user.name ?? "Sem nome",
        p.user.email,
        Number(p.amount).toFixed(2).replace(".", ","),
        p.status,
      ]),
    ];

    const csv = rows.map((r) => r.join(";")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="pagamentos-${Date.now()}.csv"`,
      },
    });
  }

  // Default: export clients
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: { Certification: true },
      },
      _count: { select: { enrollments: true, payments: true } },
    },
  });

  const rows = [
    [
      "Nome",
      "Email",
      "Data Cadastro",
      "Total Matrículas",
      "Cursos Concluídos",
      "Certificados",
    ],
    ...clients.map((c) => {
      const completed = c.enrollments.filter((e) => e.progress >= 1.0).length;
      const certs = c.enrollments.reduce(
        (sum, e) => sum + e.Certification.length,
        0
      );
      return [
        c.name ?? "Sem nome",
        c.email,
        new Date(c.createdAt).toLocaleDateString("pt-BR"),
        c._count.enrollments,
        completed,
        certs,
      ];
    }),
  ];

  const csv = rows.map((r) => r.join(";")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="alunos-${Date.now()}.csv"`,
    },
  });
}
