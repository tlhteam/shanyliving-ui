"use client";

import { useQuery } from "@tanstack/react-query";
import type { CatalogCategory } from "@/lib/catalog";

async function fetchCategories(): Promise<CatalogCategory[]> {
  const response = await fetch("/api/catalog/categories", { headers: { Accept: "application/json" } });

  if (!response.ok) {
    return [];
  }

  const body = await response.json();

  return (body?.data ?? []) as CatalogCategory[];
}

export function useCatalogCategories() {
  const query = useQuery({
    queryKey: ["catalog-categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000
  });

  return { categories: query.data ?? [], isLoading: query.isLoading };
}
