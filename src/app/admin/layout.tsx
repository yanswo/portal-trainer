import { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";
import { getAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authenticatedUser = await getAuthenticatedUser();
  if (authenticatedUser.role !== "ADMIN") redirect("/clientes");

  // Busca contagens dinâmicas para badges na nav
  const [pendingTickets, pendingBudgets, adminUser] = await Promise.all([
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.budgetRequest.count({ where: { status: { in: ["RECEIVED", "IN_REVIEW"] } } }),
    Promise.resolve(authenticatedUser),
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
