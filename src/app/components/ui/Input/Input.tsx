import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Input.module.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return <input ref={ref} type={type} className={cn(styles.input, className)} {...props} />;
});

export default Input;
