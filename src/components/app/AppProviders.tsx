"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { AppDirectionBridge } from "@/components/app/AppDirectionBridge";
import { AppThemeBridge } from "@/components/app/AppThemeBridge";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AppDirectionBridge />
        <AppThemeBridge />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </QueryClientProvider>
    </SessionProvider>
  );
}
