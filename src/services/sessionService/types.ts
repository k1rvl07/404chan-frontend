export type User = {
  ID: number;
  SessionID: number;
  IP: string;
  Nickname: string;
  CreatedAt: string;
  SessionKey: string;
};

export type CreateSessionResponse = User;

export type GetSessionUserParams = {
  session_key: string;
};
