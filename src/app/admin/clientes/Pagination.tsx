"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import Button from "@/app/components/ui/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./page.module.css";

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export default function Pagination({ currentPage, totalPages, totalItems }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createPageURL = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNumber.toString());
      return `/admin/clientes?${params.toString()}`;
    },
    [searchParams]
  );

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(createPageURL(page));
    });
  };

  if (totalItems === 0) return null;

  return (
    <div className={styles.pagination}>
      <div className={styles.pageInfo}>
        Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({totalItems} resultados)
      </div>
      <div className={styles.pageButtons}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
        >
          <FaChevronLeft /> Anterior
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
        >
          Próxima <FaChevronRight />
        </Button>
      </div>
    </div>
  );
}
