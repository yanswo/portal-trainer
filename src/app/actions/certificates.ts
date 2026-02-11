"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Generate certificate manually
export async function generateCertificateManually(enrollmentId: string) {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: true,
        course: true,
        Certification: true,
      },
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    // Check if certificate already exists
    if (enrollment.Certification.length > 0) {
      throw new Error("Certificate already exists for this enrollment");
    }

    // Create certificate
    await prisma.certification.create({
      data: {
        enrollmentId,
        status: "ISSUED",
        issuedAt: new Date(),
        format: "DIGITAL",
        certificateData: JSON.stringify({
          studentName: enrollment.user.name,
          courseName: enrollment.course.title,
          completionDate: new Date().toISOString(),
          score: "N/A", // Manual generation without exam
        }),
      },
    });

    revalidatePath("/admin/certificados");
    revalidatePath(`/admin/clientes/${enrollment.user.id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error generating certificate:", error);
    return { success: false, error: (error as Error).message };
  }
}
