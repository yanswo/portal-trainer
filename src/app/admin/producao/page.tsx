import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import Link from "next/link";
import styles from "./page.module.css";
import { FaVideo, FaClock, FaBook } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const [recentVideos, totalStats] = await Promise.all([
    prisma.video.findMany({
      take: 30,
      orderBy: { updatedAt: "desc" },
      include: {
        course: { select: { title: true, slug: true } },
      },
    }),
    prisma.video.aggregate({
      _count: { id: true },
      _sum: { duration: true },
    }),
  ]);

  const totalMinutes = totalStats._sum.duration ?? 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const totalVideos = totalStats._count.id;

  const courseCount = new Set(recentVideos.map((v) => v.course.title)).size;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Conteúdo</Badge>
          <h1>Histórico de Produção</h1>
          <p>Últimos vídeos adicionados à plataforma.</p>
        </div>
      </header>

      {/* Stats */}
      <div className={styles.analytics}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          background: "var(--color-surface)",
        }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem",
            background: "#3b82f6", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <FaVideo />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{totalVideos}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Total de Aulas</div>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          background: "var(--color-surface)",
        }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem",
            background: "#10b981", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <FaClock />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              {totalHours > 0 ? `${totalHours}h` : `${totalMinutes}min`}
            </div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Carga Horária Total</div>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          background: "var(--color-surface)",
        }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem",
            background: "#8b5cf6", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <FaBook />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{courseCount}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Cursos com Conteúdo</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell header>Aula</TableCell>
            <TableCell header>Curso</TableCell>
            <TableCell header>Tipo</TableCell>
            <TableCell header>Duração</TableCell>
            <TableCell header>Data Upload</TableCell>
            <TableCell header>Ações</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentVideos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>
                <strong>{video.title}</strong>
              </TableCell>
              <TableCell>
                {video.course.slug ? (
                  <Link
                    href={`/admin/cursos/${video.course.slug}`}
                    style={{ color: "var(--color-primary)", textDecoration: "none" }}
                  >
                    {video.course.title}
                  </Link>
                ) : (
                  video.course.title
                )}
              </TableCell>
              <TableCell>
                <Badge variant="neutral">
                  {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                </Badge>
              </TableCell>
              <TableCell>
                {video.duration ? `${video.duration} min` : "-"}
              </TableCell>
              <TableCell>
                {new Date(video.updatedAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                {video.course.slug && (
                  <Link
                    href={`/admin/cursos/${video.course.slug}`}
                    style={{ fontSize: "0.875rem", color: "var(--color-primary)", textDecoration: "none" }}
                  >
                    Ver Curso
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
          {recentVideos.length === 0 && (
            <TableRow>
              <TableCell style={{ textAlign: "center", padding: "2rem" }}>
                Sem vídeos recentes.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
