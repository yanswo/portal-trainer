import { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Busca contagens dinâmicas para badges na nav
  const [pendingTickets, pendingBudgets, adminUser] = await Promise.all([
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.budgetRequest.count({ where: { status: { in: ["RECEIVED", "IN_REVIEW"] } } }),
    prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { name: true, email: true, role: true },
    }),
  ]);

  const user = adminUser ?? {
    name: "Administrador",
    email: "admin@portaltrainer.com",
    role: "ADMIN",
  };

  return (
    <AdminShell
      user={user}
      pendingTickets={pendingTickets}
      pendingBudgets={pendingBudgets}
    >
      {children}
    </AdminShell>
  );
}
