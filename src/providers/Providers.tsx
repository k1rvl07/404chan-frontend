"use client";

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
          <ThemeProvider>{children}</ThemeProvider>
        </WebSocketProvider>
      </SessionProvider>
    </QueryClientProviderWrapper>
  );
};
