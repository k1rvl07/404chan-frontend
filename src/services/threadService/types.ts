import type { Thread } from "@types";

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

export type GetTopThreadsParams = {
  sort: "new" | "popular" | "active";
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

export type GetTopThreadsResponse = GetThreadsByBoardIDResponse;

export type GetThreadByIDResponse = Thread;
