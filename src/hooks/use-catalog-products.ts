"use client";

import { useQuery } from "@tanstack/react-query";
import type { StorefrontProduct } from "@/lib/storefront-pages";

async function fetchCatalogProducts(limit: number): Promise<StorefrontProduct[]> {
  const response = await fetch(`/api/catalog/products?limit=${limit}`, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    return [];
  }

  const body = await response.json();

  return (body?.data ?? []) as StorefrontProduct[];
}

export function useCatalogProducts(limit = 48) {
  const query = useQuery({
    queryKey: ["catalog-products", limit],
    queryFn: () => fetchCatalogProducts(limit),
    staleTime: 5 * 60 * 1000
  });

  return { products: query.data ?? [], isLoading: query.isLoading };
}
