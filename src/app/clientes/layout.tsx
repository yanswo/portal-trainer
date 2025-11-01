import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Avatar from "../components/ui/Avatar/Avatar";
import ClientNavigation from "./ClientNavigation";
import styles from "./layout.module.css";

async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("clientAuth");

  if (!authCookie) {
    redirect("/login");
  }

  try {
    const sessionPayload = JSON.parse(
      Buffer.from(authCookie.value, "base64").toString("utf-8")
    );
    const userId = sessionPayload.userId;

    if (!userId) {
      throw new Error("Invalid session payload");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      name: user.name ?? "Aluno",
      email: user.email,
    };
  } catch (error) {
    console.error("Failed to get authenticated user:", error);
    redirect("/login");
  }
}

export default async function ClientAreaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const clientAccount = await getAuthenticatedUser();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <span>Portal do cliente</span>
            <strong>CW Training</strong>
          </div>
          <div className={styles.accountSummary}>
            <Avatar name={clientAccount.name} size="sm" />
            <div>
              <strong>{clientAccount.name}</strong>
              <p>{clientAccount.email}</p>
            </div>
          </div>
        </div>
        <ClientNavigation />
      </aside>
      <div className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}
