import { HTMLAttributes, PropsWithChildren, TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Table.module.css";

type TableProps = TableHTMLAttributes<HTMLTableElement>;

type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

type TableCellProps = HTMLAttributes<HTMLTableCellElement> & { header?: boolean };

function TableRoot({ className, ...props }: PropsWithChildren<TableProps>) {
  return <table className={cn(styles.table, className)} {...props} />;
}

function TableHeader({ className, ...props }: PropsWithChildren<TableSectionProps>) {
  return <thead className={cn(styles.header, className)} {...props} />;
}

function TableBody({ className, ...props }: PropsWithChildren<TableSectionProps>) {
  return <tbody className={cn(styles.body, className)} {...props} />;
}

function TableRow({ className, ...props }: PropsWithChildren<TableRowProps>) {
  return <tr className={cn(styles.row, className)} {...props} />;
}

function TableCell({ header, className, ...props }: PropsWithChildren<TableCellProps>) {
  const Element = header ? "th" : "td";
  return <Element className={cn(header ? styles.headerCell : styles.cell, className)} {...props} />;
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
});
