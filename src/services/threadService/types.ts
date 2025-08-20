export type Thread = {
  id: number;
  board_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  authorNickname: string;
  messages_count: number;
};

export type GetThreadCooldownParams = {
  session_key: string;
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
