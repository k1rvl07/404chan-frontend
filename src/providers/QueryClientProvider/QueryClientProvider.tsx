"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import type { ProviderProps } from "./types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
    },
  },
});

export const QueryClientProviderWrapper = ({ children }: PropsWithChildren<ProviderProps>) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
