"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBudgetStatus(budgetId: string, formData: FormData) {
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;
  const proposedFee = formData.get("proposedFee") as string;

  try {
    await prisma.budgetRequest.update({
      where: { id: budgetId },
      data: {
        status: status as any,
        notes: notes || undefined,
        proposedFee: proposedFee ? parseFloat(proposedFee) : undefined,
      },
    });

    revalidatePath("/admin/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: "Falha ao atualizar orçamento" };
  }
}
