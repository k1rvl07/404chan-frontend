import type { Message } from "@types";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetMessageByThreadIDResponse = {
  messages: Message[];
  pagination: Pagination;
};

export type CreateMessageParams = {
  thread_id: number;
  content: string;
  session_key: string;
  parent_id?: number | null;
};

export type GetMessageByThreadIDParams = {
  thread_id: number;
  page?: number;
  limit?: number;
};

export type GetMessageCooldownParams = {
  session_key: string;
};

export type GetMessageCooldownResponse = {
  lastMessageCreationUnix: number | null;
};
