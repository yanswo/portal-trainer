import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function ProductionPage() {
  const recentVideos = await prisma.video.findMany({
    take: 20,
    orderBy: { updatedAt: "desc" },
    include: { course: { select: { title: true } } },
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Conteúdo</Badge>
          <h1>Histórico de Produção</h1>
          <p>Últimos vídeos adicionados à plataforma.</p>
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell header>Aula</TableCell>
            <TableCell header>Curso</TableCell>
            <TableCell header>Duração</TableCell>
            <TableCell header>Data Upload</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentVideos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>
                <strong>{video.title}</strong>
              </TableCell>
              <TableCell>{video.course.title}</TableCell>
              <TableCell>
                {video.duration ? `${video.duration} min` : "-"}
              </TableCell>
              <TableCell>
                {new Date(video.updatedAt).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
          {recentVideos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                style={{ textAlign: "center", padding: "2rem" }}
              >
                Sem vídeos recentes.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
