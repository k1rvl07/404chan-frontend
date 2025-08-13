"use client";

import { ErrorBoundaryProvider } from "./ErrorBoundaryProvider";
import { QueryClientProviderWrapper } from "./QueryClientProvider";
import { SessionProvider } from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import type { ProvidersProps } from "./types";

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProviderWrapper>
      <SessionProvider>
        <WebSocketProvider>
          <ErrorBoundaryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ErrorBoundaryProvider>
        </WebSocketProvider>
      </SessionProvider>
    </QueryClientProviderWrapper>
  );
};
