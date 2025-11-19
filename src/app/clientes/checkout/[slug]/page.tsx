import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import CheckoutForm from "../CheckoutForm";
import styles from "../checkout.module.css";

type CheckoutPageProps = {
  params: { slug: string };
};

async function getCourse(identifier: string) {
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ slug: identifier }, { id: identifier }],
      isPublished: true,
    },
  });

  if (!course) {
    notFound();
  }
  return course;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const resolvedParams = await params;

  const course = await getCourse(resolvedParams.slug);

  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      courseId: course.id,
    },
  });

  const plainCourse = {
    id: course.id,
    title: course.title,
    price: Number(course.price),
    slug: course.slug,
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Checkout Seguro</Badge>
        <h1>Finalizar Matrícula</h1>
        <p>
          Você está a um passo de liberar seu acesso ao curso{" "}
          <strong>{course.title}</strong>.
        </p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.summary}>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.courseItem}>
                <span>Curso</span>
                <span style={{ textAlign: "right", maxWidth: "60%" }}>
                  {course.title}
                </span>
              </div>
              <div className={styles.courseItem}>
                <span>Duração</span>
                <strong>{course.duration ?? "N/D"}</strong>
              </div>
              <div className={styles.total}>
                <span>Total a pagar</span>
                <strong>{`R$ ${Number(course.price)
                  .toFixed(2)
                  .replace(".", ",")}`}</strong>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className={styles.formSection}>
          {existingEnrollment ? (
            <Card>
              <CardHeader>
                <CardTitle>Você já é aluno deste curso! 🎉</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Não é necessário comprar novamente. Seu acesso já está
                  liberado na biblioteca.
                </p>
                <div style={{ marginTop: "1.5rem" }}>
                  <a href="/clientes/biblioteca" className={styles.linkButton}>
                    Ir para meus cursos
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CheckoutForm user={user} course={plainCourse} />
          )}
        </main>
      </div>
    </div>
  );
}
