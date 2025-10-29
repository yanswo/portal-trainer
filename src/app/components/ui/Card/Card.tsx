import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Card.module.css";

type CardElementProps = HTMLAttributes<HTMLDivElement>;

function CardRoot({ className, ...props }: CardElementProps) {
  return <div className={cn(styles.card, className)} {...props} />;
}

function CardHeader({ className, ...props }: CardElementProps) {
  return <div className={cn(styles.header, className)} {...props} />;
}

function CardContent({ className, ...props }: CardElementProps) {
  return <div className={cn(styles.content, className)} {...props} />;
}

function CardFooter({ className, ...props }: CardElementProps) {
  return <div className={cn(styles.footer, className)} {...props} />;
}

function CardTitle({ className, ...props }: CardElementProps) {
  return <h3 className={cn(styles.title, className)} {...props} />;
}

function CardDescription({ className, ...props }: CardElementProps) {
  return <p className={cn(styles.description, className)} {...props} />;
}

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
});

export { Card, CardRoot, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
