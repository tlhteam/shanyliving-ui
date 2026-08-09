"use client";

import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";
import type { ApiRequest } from "@/lib/api-client";

export function useCustomerQuery<T>(key: string, path: string) {
  const { request, token } = useApi();

  return useQuery({
    queryKey: ["customer", key],
    enabled: Boolean(token),
    queryFn: () => request<T>(path)
  });
}

export function useCustomerMutation<TVariables, TResult>(
  key: string,
  build: (variables: TVariables) => { path: string; options: ApiRequest },
  options: { successMessage?: string } & Omit<UseMutationOptions<TResult, Error, TVariables>, "mutationFn"> = {}
) {
  const { request } = useApi();
  const queryClient = useQueryClient();
  const { successMessage, onSuccess, ...rest } = options;

  return useMutation<TResult, Error, TVariables>({
    mutationFn: (variables) => {
      const { path, options: requestOptions } = build(variables);

      return request<TResult>(path, requestOptions);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["customer", key] });
      queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });

      if (successMessage) {
        toast.success(successMessage);
      }

      onSuccess?.(...args);
    },
    onError: (error: Error) => toast.error(error.message),
    ...rest
  });
}
