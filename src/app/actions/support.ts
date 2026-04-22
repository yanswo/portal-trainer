"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
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

export async function createSupportTicket(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Não autenticado" };

  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!subject || !message) {
    return { success: false, error: "Preencha todos os campos" };
  }

  try {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        message,
        status: "OPEN",
        messages: {
          create: {
            body: message,
            sender: "CLIENT",
          },
        },
      },
    });

    revalidatePath("/clientes/suporte");
    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "Falha ao criar chamado" };
  }
}

export async function sendSupportMessage(ticketId: string, formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Não autenticado" };

  const body = formData.get("body") as string;
  if (!body) return { success: false, error: "Mensagem vazia" };

  try {
    // Verify the ticket belongs to the user
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: ticketId, userId },
    });

    if (!ticket) return { success: false, error: "Chamado não encontrado" };

    await prisma.supportMessage.create({
      data: {
        ticketId,
        body,
        sender: "CLIENT",
      },
    });

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/clientes/suporte");
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Falha ao enviar mensagem" };
  }
}

// Admin: reply to ticket
export async function adminReplyToTicket(ticketId: string, formData: FormData) {
  const body = formData.get("body") as string;
  const newStatus = formData.get("status") as string;

  if (!body) return { success: false, error: "Mensagem vazia" };

  try {
    await prisma.supportMessage.create({
      data: {
        ticketId,
        body,
        sender: "ADMIN",
      },
    });

    if (newStatus) {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: newStatus, updatedAt: new Date() },
      });
    } else {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { updatedAt: new Date() },
      });
    }

    revalidatePath("/admin/suporte");
    return { success: true };
  } catch (error) {
    console.error("Error replying to ticket:", error);
    return { success: false, error: "Falha ao responder chamado" };
  }
}
