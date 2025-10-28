import { useId } from "react";
import styles from "./Chart.module.css";

export type ChartPoint = {
  label: string;
  value: number;
};

interface ChartProps {
  title: string;
  description?: string;
  data: ChartPoint[];
  prefix?: string;
  suffix?: string;
}

export default function Chart({ title, description, data, prefix = "", suffix = "" }: ChartProps) {
  const gradientId = useId();

  if (data.length === 0) {
    return null;
  }

  const values = data.map((point) => point.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const lastPoint = data[data.length - 1];

  const coordinates = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 36 - ((point.value - min) / range) * 28;
    return { ...point, x, y };
  });

  const polylinePoints = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `0,36 ${polylinePoints} 100,36`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className={styles.label}>{title}</span>
          <strong className={styles.value}>
            {prefix}
            {lastPoint.value.toLocaleString("pt-BR")}
            {suffix}
          </strong>
        </div>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      <svg className={styles.chart} viewBox="0 0 100 40" preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(17, 17, 17, 0.35)" />
            <stop offset="100%" stopColor="rgba(17, 17, 17, 0.05)" />
          </linearGradient>
        </defs>
        <polygon className={styles.area} points={areaPoints} style={{ fill: `url(#${gradientId})` }} />
        <polyline className={styles.line} points={polylinePoints} />
        {coordinates.map((point) => (
          <circle key={point.label} className={styles.dot} cx={point.x} cy={point.y} r={1.3} />
        ))}
        <line className={styles.baseline} x1="0" y1="36" x2="100" y2="36" />
      </svg>
      <div className={styles.axis}>
        {coordinates.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
