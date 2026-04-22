"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import Input from "@/app/components/ui/Input/Input";
import Select from "@/app/components/ui/Select/Select";
import Button from "@/app/components/ui/Button";
import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./page.module.css";

type CourseOption = {
  id: string;
  title: string;
};

export default function ProductionFilters({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  const updateFilters = useCallback(
    (newSearch: string, newCourse: string, newType: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (newSearch) params.set("search", newSearch);
      else params.delete("search");
      
      if (newCourse) params.set("courseId", newCourse);
      else params.delete("courseId");
      
      if (newType) params.set("type", newType);
      else params.delete("type");
      
      // Reset page when filtering
      params.delete("page");

      startTransition(() => {
        router.push(`/admin/producao?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, courseId, type);
  };

  const handleClear = () => {
    setSearch("");
    setCourseId("");
    setType("");
    startTransition(() => {
      router.push(`/admin/producao`);
    });
  };

  return (
    <div className={styles.controlsBar}>
      <form onSubmit={handleSearch} className={styles.searchGroup}>
        <Input 
          placeholder="Buscar aula pelo nome..." 
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
          value={courseId} 
          onChange={(e) => {
            setCourseId(e.target.value);
            updateFilters(search, e.target.value, type);
          }}
          disabled={isPending}
        >
          <option value="">Todos os Cursos</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </Select>
        <Select 
          value={type} 
          onChange={(e) => {
            setType(e.target.value);
            updateFilters(search, courseId, e.target.value);
          }}
          disabled={isPending}
        >
          <option value="">Todos os Tipos</option>
          <option value="THEORY">Teórico</option>
          <option value="PRACTICE">Prático</option>
          <option value="ASSESSMENT">Avaliação</option>
        </Select>
        {(search || courseId || type) && (
          <Button variant="ghost" onClick={handleClear} disabled={isPending}>
            <FaTimes /> Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
