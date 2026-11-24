"use client";

import ThemeToggle from "../ui/ThemeToggle/ThemeToggle";
import styles from "./LandingThemeToggle.module.css";

export default function LandingThemeToggle() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Tema</span>
      <ThemeToggle />
    </div>
  );
}
