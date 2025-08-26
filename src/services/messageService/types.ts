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
