export type User = {
  ID: number;
  Nickname: string;
  CreatedAt: string;
  SessionStartedAt: string;
  SessionKey: string;
  MessagesCount: number;
  ThreadsCount: number;
};

export type WebSocketEvent =
  | {
      event: "nickname_updated";
      user_id: number;
      nickname: string;
      timestamp: number;
    }
  | {
      event: "stats_updated";
      user_id: number;
      message_count: number;
      thread_count: number;
    };
