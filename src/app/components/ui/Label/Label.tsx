import { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Label.module.css";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ className, ...props }: LabelProps) {
  return <label className={cn(styles.label, className)} {...props} />;
}
