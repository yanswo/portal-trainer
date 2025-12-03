import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clientAuth");

  if (!authCookie) {
    redirect("/login");
  }

  try {
    const sessionPayload = JSON.parse(
      Buffer.from(authCookie.value, "base64").toString("utf-8")
    );
    const userId = sessionPayload.userId;
    if (!userId) throw new Error("Invalid session payload");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: { select: { avatarUrl: true } },
      },
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    console.error("Failed to get authenticated user:", error);
    redirect("/login");
  }
}
