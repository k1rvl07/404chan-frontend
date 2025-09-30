import type { Thread } from "@types";
import { apiClient } from "../api";
import type {
  CheckThreadAuthorParams,
  CheckThreadAuthorResponse,
  CreateThreadParams,
  GetThreadByIDParams,
  GetThreadByIDResponse,
  GetThreadCooldownParams,
  GetThreadCooldownResponse,
  GetThreadsByBoardIDParams,
  GetThreadsByBoardIDResponse,
  GetTopThreadsParams,
  GetTopThreadsResponse,
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

  getTopThreads: async (params: GetTopThreadsParams): Promise<GetTopThreadsResponse> => {
    const res = await apiClient.get("/threads/top", {
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

  checkThreadAuthor: async (params: CheckThreadAuthorParams): Promise<CheckThreadAuthorResponse> => {
    const res = await apiClient.get(`/threads/check-author/${params.thread_id}`, {
      params: { session_key: params.session_key },
    });
    return res.data;
  },
};
