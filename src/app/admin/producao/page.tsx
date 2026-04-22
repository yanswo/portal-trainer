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
import { FaVideo, FaClock, FaBook, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import ProductionFilters from "./ProductionFilters";
import Pagination from "./Pagination";
import VideoRowActions from "./VideoRowActions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    courseId?: string;
    type?: string;
    page?: string;
  }>;
};

const ITEMS_PER_PAGE = 20;

export default async function ProductionPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const courseId = resolvedParams.courseId || "";
  const type = resolvedParams.type || "";
  const currentPage = Number(resolvedParams.page) || 1;

  // Build where clause
  const where: any = {};
  if (search) {
    where.title = { contains: search };
  }
  if (courseId) {
    where.courseId = courseId;
  }
  if (type) {
    where.type = type;
  }

  // Get all courses for the filter dropdown
  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  // Main query with pagination
  const [videos, totalItems, totalStats] = await Promise.all([
    prisma.video.findMany({
      where,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: { updatedAt: "desc" },
      include: {
        course: { select: { title: true, slug: true } },
      },
    }),
    prisma.video.count({ where }),
    prisma.video.aggregate({
      _count: { id: true },
      _sum: { duration: true },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Stats formatting
  const totalMinutes = totalStats._sum.duration ?? 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const totalVideosAllTime = totalStats._count.id;
  const courseCount = new Set(videos.map((v) => v.course.title)).size;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Conteúdo</Badge>
          <h1>Acervo de Produção</h1>
          <p>Gerencie e busque todas as aulas cadastradas na plataforma.</p>
        </div>
      </header>

      {/* Premium Stats Dashboard */}
      <div className={styles.analytics}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapper} style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
            <FaVideo />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalVideosAllTime}</div>
            <div className={styles.statLabel}>Total de Aulas</div>
            <div className={`${styles.trendBadge} ${styles.trendUp}`}>
              <FaArrowUp /> Acervo completo
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapper} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
            <FaClock />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>
              {totalHours > 0 ? `${totalHours}h` : `${totalMinutes}m`}
            </div>
            <div className={styles.statLabel}>Carga Horária Produzida</div>
            <div className={`${styles.trendBadge} ${styles.trendUp}`}>
              <FaArrowUp /> Crescendo
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapper} style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
            <FaBook />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{courses.length}</div>
            <div className={styles.statLabel}>Cursos Cadastrados</div>
            <div className={`${styles.trendBadge} ${styles.trendNeutral}`}>
              <FaMinus /> Ativos na base
            </div>
          </div>
        </div>
      </div>

      <ProductionFilters courses={courses} />

      {/* Table */}
      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Aula</TableCell>
              <TableCell header>Curso</TableCell>
              <TableCell header>Tipo</TableCell>
              <TableCell header>Duração</TableCell>
              <TableCell header>Modificada em</TableCell>
              <TableCell header style={{ textAlign: "right" }}>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <strong style={{ color: "var(--color-text-primary)" }}>{video.title}</strong>
                </TableCell>
                <TableCell>
                  {video.course.slug ? (
                    <Link
                      href={`/admin/cursos/${video.course.slug}`}
                      style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}
                    >
                      {video.course.title}
                    </Link>
                  ) : (
                    video.course.title
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" size="sm">
                    {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                  </Badge>
                </TableCell>
                <TableCell style={{ color: "var(--color-text-muted)" }}>
                  {video.duration ? `${video.duration} min` : "-"}
                </TableCell>
                <TableCell style={{ color: "var(--color-text-muted)" }}>
                  {new Date(video.updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "short", year: "numeric"
                  })}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  {video.course.slug ? (
                    <VideoRowActions courseSlug={video.course.slug} videoUrl={video.url} />
                  ) : (
                    <span style={{ color: "var(--color-text-muted)" }}>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {videos.length === 0 && (
              <TableRow>
                <TableCell style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
                  Nenhuma aula encontrada para os filtros aplicados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={totalItems} 
        />
      </div>
    </div>
  );
}
