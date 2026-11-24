import type { ReactNode } from "react";
import { getAuthenticatedUser } from "@/lib/session";
import ClientAreaShell from "./ClientAreaShell";

export default async function ClientAreaLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  return (
    <ClientAreaShell
      account={{ name: user.name ?? "Aluno", email: user.email, avatarUrl: user.profile?.avatarUrl }}
    >
      {children}
    </ClientAreaShell>
  );
}
