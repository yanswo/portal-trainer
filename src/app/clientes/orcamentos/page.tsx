import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import { allCourses, budgetFilters, budgets } from "@/data/client-portal";

const activeFilter = "all";

export default function BudgetsPage() {
  return (
    <div>
      <header className={styles.header}>
        <Badge variant="outline">Orçamentos</Badge>
        <h1>Propostas e simulações personalizadas</h1>
        <p>
          Ajuste quantidades de licenças, acompanhe o status das negociações e gere novas
          propostas com valores atualizados.
        </p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {budgetFilters.map((filter) => (
            <button
              key={filter.value}
              className={`${styles.filterButton} ${
                filter.value === activeFilter ? styles.status : ""
              }`.trim()}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <Button href="/clientes/orcamentos/novo">Novo orçamento</Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Curso</th>
              <th>Vagas</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Válido até</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => {
              const course = allCourses.find((item) => item.slug === budget.courseSlug);
              return (
                <tr key={budget.id}>
                  <td>{budget.id}</td>
                  <td>{course?.title}</td>
                  <td>{budget.seats}</td>
                  <td>{budget.amount}</td>
                  <td>
                    <span className={styles.status}>{budget.status}</span>
                  </td>
                  <td>{budget.validUntil}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <strong>Próximo passo sugerido</strong>
          <span>Envie a proposta BGT-2031 com condições atualizadas.</span>
        </div>
        <div className={styles.summaryCard}>
          <strong>Economia estimada</strong>
          <span>R$ 1.280,00 negociados com licenças combinadas.</span>
        </div>
        <div className={styles.summaryCard}>
          <strong>Contato responsável</strong>
          <span>Equipe financeira CW Training · financeiro@cwtraining.com</span>
        </div>
      </div>
    </div>
  );
}
