import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ThemeState } from "./types";

const isClient = typeof window !== "undefined";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",

      toggleTheme: () => {
        const newMode = get().mode === "light" ? "dark" : "light";
        set({ mode: newMode });
      },
    }),
    {
      name: "404chan-theme",
      storage: createJSONStorage(() => (isClient ? localStorage : ({} as Storage))),
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);
