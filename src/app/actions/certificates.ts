"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Custom type for certificateData JSON
export type CertificateDataPayload = {
  studentName?: string | null;
  courseName?: string;
  completionDate?: string;
  score?: string;
  trackingCode?: string;
  shippingStatus?: "PREPARING" | "SHIPPED" | "DELIVERED";
  deliveryAddress?: string;
  notes?: string;
  issuedBy?: string;
};

// Generate certificate manually with format & shipping details
export async function generateCertificateManually(
  enrollmentId: string,
  format: "DIGITAL" | "PHYSICAL" | "DIGITAL_AND_PHYSICAL" = "DIGITAL",
  trackingCode?: string,
  shippingStatus: "PREPARING" | "SHIPPED" | "DELIVERED" = "PREPARING",
  notes?: string
) {
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
      return { success: false, error: "Matrícula não encontrada" };
    }

    if (enrollment.Certification.length > 0) {
      return { success: false, error: "Já existe certificado para esta matrícula" };
    }

    const payload: CertificateDataPayload = {
      studentName: enrollment.user.name,
      courseName: enrollment.course.title,
      completionDate: new Date().toISOString(),
      score: "100%",
      trackingCode: trackingCode || undefined,
      shippingStatus: format !== "DIGITAL" ? shippingStatus : undefined,
      notes: notes || undefined,
    };

    await prisma.certification.create({
      data: {
        enrollmentId,
        status: "ISSUED",
        issuedAt: new Date(),
        format,
        certificateData: JSON.stringify(payload),
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

// Update existing certificate status, format, and physical shipping tracking
export async function updateCertificateDetails(
  certificateId: string,
  data: {
    status?: "ISSUED" | "PENDING" | "REVOKED";
    format?: "DIGITAL" | "PHYSICAL" | "DIGITAL_AND_PHYSICAL";
    trackingCode?: string;
    shippingStatus?: "PREPARING" | "SHIPPED" | "DELIVERED";
    notes?: string;
  }
) {
  try {
    const cert = await prisma.certification.findUnique({
      where: { id: certificateId },
    });

    if (!cert) {
      return { success: false, error: "Certificado não encontrado" };
    }

    let existingData: CertificateDataPayload = {};
    if (cert.certificateData) {
      try {
        existingData = typeof cert.certificateData === "string"
          ? JSON.parse(cert.certificateData)
          : (cert.certificateData as CertificateDataPayload);
      } catch {
        existingData = {};
      }
    }

    const updatedData: CertificateDataPayload = {
      ...existingData,
      trackingCode: data.trackingCode !== undefined ? data.trackingCode : existingData.trackingCode,
      shippingStatus: data.shippingStatus !== undefined ? data.shippingStatus : existingData.shippingStatus,
      notes: data.notes !== undefined ? data.notes : existingData.notes,
    };

    await prisma.certification.update({
      where: { id: certificateId },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.format && { format: data.format }),
        certificateData: JSON.stringify(updatedData),
      },
    });

    revalidatePath("/admin/certificados");
    return { success: true };
  } catch (error) {
    console.error("Error updating certificate:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Revoke a certificate
export async function revokeCertificate(certificateId: string) {
  try {
    await prisma.certification.update({
      where: { id: certificateId },
      data: { status: "REVOKED" },
    });

    revalidatePath("/admin/certificados");
    return { success: true };
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return { success: false, error: (error as Error).message };
  }
}
