import styles from "./PartnerMarquee.module.css";

const partners = [
  "Vale",
  "Petrobras",
  "Siemens",
  "Votorantim",
  "CCR",
  "Braskem",
];

export default function PartnerMarquee() {
  return (
    <section className={styles.section} aria-label="Empresas que confiam no portal">
      <div className={styles.container}>
        <p className={styles.title}>Empresas que confiam nas nossas formações</p>
        <div className={styles.marquee}>
          {partners.map((partner) => (
            <span key={partner} className={styles.partner}>
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
