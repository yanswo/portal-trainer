import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clientAuth");
  if (!authCookie) return null;

  const session = verifySessionToken(authCookie.value);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: { select: { avatarUrl: true } },
    },
  });
}

export async function getAuthenticatedUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
