"use client";

import { useTheme } from "../../providers/ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="Alternar tema"
      title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      <div className={styles.track}>
        <div className={styles.icon} data-visible={theme === "light"}>
          <FaSun />
        </div>
        <div className={styles.icon} data-visible={theme === "dark"}>
          <FaMoon />
        </div>
      </div>
    </button>
  );
}
