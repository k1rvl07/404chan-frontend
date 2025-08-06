"use client";

import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";
import type { ProvidersProps } from "./types";

export const ThemeProvider = ({ children }: ProvidersProps) => {
  const { mode } = useThemeStore();

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return <>{children}</>;
};
