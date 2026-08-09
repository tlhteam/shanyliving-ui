"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { apiFetch, type ApiRequest } from "@/lib/api-client";

export function useApi() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const request = useCallback(
    <T,>(path: string, options: ApiRequest = {}) => apiFetch<T>(path, { ...options, token }),
    [token]
  );

  return { request, token };
}
