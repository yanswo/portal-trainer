import styles from "./Progress.module.css";

interface ProgressProps {
  value: number;
  label?: string;
}

export default function Progress({ value, label }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.wrapper} role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
}
