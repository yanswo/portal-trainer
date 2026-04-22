"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import Input from "@/app/components/ui/Input/Input";
import Select from "@/app/components/ui/Select/Select";
import Button from "@/app/components/ui/Button";
import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./page.module.css";

export default function ClientFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");

  const updateFilters = useCallback(
    (newSearch: string, newStatus: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (newSearch) params.set("search", newSearch);
      else params.delete("search");
      
      if (newStatus) params.set("status", newStatus);
      else params.delete("status");
      
      // Reset page when filtering
      params.delete("page");

      startTransition(() => {
        router.push(`/admin/clientes?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, statusFilter);
  };

  const handleClear = () => {
    setSearch("");
    setStatusFilter("");
    startTransition(() => {
      router.push(`/admin/clientes`);
    });
  };

  return (
    <div className={styles.controlsBar}>
      <form onSubmit={handleSearch} className={styles.searchGroup}>
        <Input 
          placeholder="Buscar por nome ou e-mail..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button type="submit" disabled={isPending}>
          <FaSearch /> Buscar
        </Button>
      </form>
      <div className={styles.filterGroup}>
        <Select 
          value={statusFilter} 
          onChange={(e) => {
            setStatusFilter(e.target.value);
            updateFilters(search, e.target.value);
          }}
          disabled={isPending}
        >
          <option value="">Todos os status</option>
          <option value="active">Com matrículas ativas</option>
          <option value="completed">Com cursos concluídos</option>
          <option value="inactive">Sem cursos ativos</option>
        </Select>
        {(search || statusFilter) && (
          <Button variant="ghost" onClick={handleClear} disabled={isPending}>
            <FaTimes /> Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
