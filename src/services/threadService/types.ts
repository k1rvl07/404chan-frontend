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

export type CreateThreadParams = {
  board_id: number;
  title: string;
  content: string;
  session_key: string;
};

export type GetThreadsByBoardIDParams = {
  board_id: number;
  sort: string;
  page?: number;
  limit?: number;
};

export type GetThreadCooldownParams = {
  session_key: string;
};

export type GetThreadByIDParams = {
  id: number;
};

export type GetThreadCooldownResponse = {
  lastThreadCreationUnix: number | null;
};

export type GetThreadsByBoardIDResponse = {
  threads: Thread[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetThreadByIDResponse = Thread;
