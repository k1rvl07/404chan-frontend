export type CreateSessionResponse = {
  ID: number;
  Nickname: string;
  SessionStartedAt: string;
  SessionKey: string;
};

export type User = {
  ID: number;
  Nickname: string;
  CreatedAt: string;
  SessionStartedAt: string;
  SessionKey: string;
  MessagesCount: number;
  ThreadsCount: number;
};
