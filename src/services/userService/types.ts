export type User = {
  ID: number;
  Nickname: string;
  CreatedAt: string;
  SessionStartedAt: string;
  SessionKey: string;
  MessagesCount: number;
  ThreadsCount: number;
};

export type GetUserBySessionKeyParams = {
  session_key: string;
};

export type UpdateNicknameParams = {
  session_key: string;
  nickname: string;
};

export type GetCooldownResponse = {
  lastNicknameChangeUnix: number | null;
};
