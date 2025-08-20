export type SessionState = {
  sessionKey: string | null;
  userId: number | null;
  nickname: string;
  createdAt: string | null;
  nicknameChangeCooldownUntil: number | null;
  lastNicknameUpdateServerTime: number | null;
  threadCreationCooldownUntil: number | null;
  lastThreadCreationServerTime: number | null;
  setNickname: (nickname: string) => void;
  setNicknameChangeCooldownUntil: (timestamp: number | null) => void;
  setLastNicknameUpdateServerTime: (timestamp: number | null) => void;
  setThreadCreationCooldownUntil: (timestamp: number | null) => void;
  setLastThreadCreationServerTime: (timestamp: number | null) => void;
  clear: () => void;
};
