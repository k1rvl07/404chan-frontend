import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import type { SessionState } from "./types";

export const useSessionStore = create<SessionState>()(
  subscribeWithSelector(
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
        messageCreationCooldownUntil: null,
        lastMessageCreationServerTime: null,

        setNickname: (nickname: string) => set({ nickname }),
        setNicknameChangeCooldownUntil: (timestamp: number | null) => set({ nicknameChangeCooldownUntil: timestamp }),
        setLastNicknameUpdateServerTime: (timestamp: number | null) => set({ lastNicknameUpdateServerTime: timestamp }),
        setThreadCreationCooldownUntil: (timestamp: number | null) => set({ threadCreationCooldownUntil: timestamp }),
        setLastThreadCreationServerTime: (timestamp: number | null) => set({ lastThreadCreationServerTime: timestamp }),
        setMessageCreationCooldownUntil: (timestamp: number | null) => set({ messageCreationCooldownUntil: timestamp }),
        setLastMessageCreationServerTime: (timestamp: number | null) =>
          set({ lastMessageCreationServerTime: timestamp }),

        clear: () => {
          set({
            sessionKey: null,
            userId: null,
            nickname: "Аноним",
            createdAt: null,
            nicknameChangeCooldownUntil: null,
            lastNicknameUpdateServerTime: null,
            threadCreationCooldownUntil: null,
            lastThreadCreationServerTime: null,
            messageCreationCooldownUntil: null,
            lastMessageCreationServerTime: null,
          });
        },
      }),
      {
        name: "404chan-session",
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
      },
    ),
  ),
);
