import { apiClient } from "../api";
import type { GetThreadCooldownParams, GetThreadCooldownResponse, GetThreadsByBoardIDResponse, Thread } from "./types";

export const threadService = {
  createThread: async (params: { board_id: number; title: string; content: string }): Promise<Thread> => {
    const { board_id, title, content } = params;
    const res = await apiClient.post(`/threads/${board_id}`, { title, content });
    return res.data;
  },
  getThreadsByBoardID: async (params: {
    board_id: number;
    sort: string;
    page?: number;
    limit?: number;
  }): Promise<GetThreadsByBoardIDResponse> => {
    const { board_id, sort, page = 1, limit = 10 } = params;
    const res = await apiClient.get(`/threads/${board_id}`, {
      params: { sort, page, limit },
    });
    return res.data;
  },
  getThreadCooldown: async (params: GetThreadCooldownParams): Promise<GetThreadCooldownResponse> => {
    const res = await apiClient.get("/threads/cooldown", { params });
    return res.data;
  },
};

export type ThreadService = typeof threadService;
