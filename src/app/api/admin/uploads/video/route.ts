import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAuthenticatedUser } from "@/lib/session";

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Selecione um vídeo." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Use MP4, WebM ou MOV." }, { status: 400 });
    }
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ error: "O vídeo deve ter no máximo 500 MB." }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeName), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({ url: `/uploads/videos/${safeName}`, name: file.name });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Não foi possível enviar o vídeo." }, { status: 500 });
  }
}
