import type { ReactNode } from "react";

export type WithChildren<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  children?: ReactNode;
};

export type Message = {
  id: number;
  thread_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  author_nickname: string;
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

export type CreateSessionResponse = {
  ID: number;
  Nickname: string;
  CreatedAt: string;
  SessionKey: string;
};

export type Thread = {
  id: number;
  board_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  author_nickname: string;
  messages_count: number;
};
