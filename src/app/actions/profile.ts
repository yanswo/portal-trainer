"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clientAuth");
  if (!authCookie) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(authCookie.value, "base64").toString("utf-8")
    );
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function updateProfile(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Não autenticado" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const cpf = formData.get("cpf") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        cpf: cpf || undefined,
        city: city || undefined,
        state: state || undefined,
      },
    });

    revalidatePath("/clientes/configuracoes");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Falha ao atualizar perfil" };
  }
}

export async function changePassword(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Não autenticado" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "Preencha todos os campos" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "A nova senha deve ter pelo menos 6 caracteres" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "As senhas não coincidem" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Senha atual incorreta" };
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath("/clientes/configuracoes");
    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Falha ao alterar senha" };
  }
}
