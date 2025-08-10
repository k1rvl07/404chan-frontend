import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SessionState } from "./types";

export const useSessionStore = create<SessionState>()(
  persist<SessionState>(
    (set) => ({
      sessionKey: null,
      userId: null,
      nickname: "Аноним",
      createdAt: null,
      clear: () => {
        useSessionStore.setState({
          sessionKey: null,
          userId: null,
          createdAt: null,
        });
      },
      setNickname: (nickname: string) => set({ nickname }),
    }),
    {
      name: "404chan-session",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
