import { apiClient } from "../api";
import type {
  CreateThreadParams,
  GetThreadByIDParams,
  GetThreadByIDResponse,
  GetThreadCooldownParams,
  GetThreadCooldownResponse,
  GetThreadsByBoardIDParams,
  GetThreadsByBoardIDResponse,
  Thread,
} from "./types";

export const threadService = {
  createThread: async (params: CreateThreadParams): Promise<Thread> => {
    const res = await apiClient.post(
      `/threads/${params.board_id}`,
      {
        title: params.title,
        content: params.content,
      },
      {
        params: { session_key: params.session_key },
      },
    );
    return res.data;
  },

  getThreadsByBoardID: async (params: GetThreadsByBoardIDParams): Promise<GetThreadsByBoardIDResponse> => {
    const res = await apiClient.get(`/threads/${params.board_id}`, {
      params: {
        sort: params.sort,
        page: params.page,
        limit: params.limit,
      },
    });
    return res.data;
  },

  getThreadCooldown: async (params: GetThreadCooldownParams): Promise<GetThreadCooldownResponse> => {
    const res = await apiClient.get("/threads/cooldown", {
      params: { session_key: params.session_key },
    });
    return res.data;
  },

  getThreadByID: async (params: GetThreadByIDParams): Promise<GetThreadByIDResponse> => {
    const res = await apiClient.get(`/threads/thread/${params.id}`);
    return res.data;
  },
};
