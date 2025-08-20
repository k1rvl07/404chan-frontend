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
      nicknameChangeCooldownUntil: null,
      lastNicknameUpdateServerTime: null,
      threadCreationCooldownUntil: null,
      lastThreadCreationServerTime: null,

      setNickname: (nickname: string) => set({ nickname }),

      setNicknameChangeCooldownUntil: (timestamp: number | null) => set({ nicknameChangeCooldownUntil: timestamp }),

      setLastNicknameUpdateServerTime: (timestamp: number | null) => set({ lastNicknameUpdateServerTime: timestamp }),

      setThreadCreationCooldownUntil: (timestamp: number | null) => set({ threadCreationCooldownUntil: timestamp }),

      setLastThreadCreationServerTime: (timestamp: number | null) => set({ lastThreadCreationServerTime: timestamp }),

      clear: () => {
        useSessionStore.setState({
          sessionKey: null,
          userId: null,
          nickname: "Аноним",
          createdAt: null,
          nicknameChangeCooldownUntil: null,
          lastNicknameUpdateServerTime: null,
          threadCreationCooldownUntil: null,
          lastThreadCreationServerTime: null,
        });
      },
    }),
    {
      name: "404chan-session",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
