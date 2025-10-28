import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Select.module.css";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className={styles.wrapper}>
      <select ref={ref} className={cn(styles.select, className)} {...props}>
        {children}
      </select>
      <span aria-hidden className={styles.chevron} />
    </div>
  );
});

export default Select;
