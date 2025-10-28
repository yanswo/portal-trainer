import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Textarea.module.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(styles.textarea, className)} {...props} />;
});

export default Textarea;
