export type SessionState = {
  sessionKey: string | null;
  userId: number | null;
  nickname: string;
  createdAt: string | null;
  clear: () => void;
};
