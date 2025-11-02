import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import CheckoutForm from "../CheckoutForm";
import styles from "../checkout.module.css";

type CheckoutPageProps = {
  params: { slug: string };
};

async function getCourseBySlug(slug: string) {
  const course = await prisma.course.findFirst({
    where: { slug: slug, isPublished: true },
  });
  if (!course) {
    notFound();
  }
  return course;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const resolvedParams = await params;
  const user = await getAuthenticatedUser();

  const course = await getCourseBySlug(resolvedParams.slug);

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
        <Badge variant="outline">Checkout</Badge>
        <h1>Finalizar matrícula</h1>
        <p>Preencha seus dados e confirme a inscrição no curso.</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.summary}>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.courseItem}>
                <span>{course.title}</span>
                <strong>{`R$ ${Number(course.price)
                  .toFixed(2)
                  .replace(".", ",")}`}</strong>
              </div>
              <div className={styles.total}>
                <span>Total</span>
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
                <CardTitle>Você já está matriculado</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Você já possui acesso a este curso. Acesse sua biblioteca para
                  começar a estudar.
                </p>
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
