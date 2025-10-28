import styles from "./PartnerMarquee.module.css";

const partners = [
  "Vale",
  "Petrobras",
  "Siemens",
  "Votorantim",
  "CCR",
  "Braskem",
  "Gerdau",
  "Raízen",
];

export default function PartnerMarquee() {
  return (
    <section className={styles.section} aria-label="Organizações que confiam na CW Training">
      <div className={styles.container}>
        <p className={styles.title}>Empresas que potencializam seus treinamentos com a CW Training</p>
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
