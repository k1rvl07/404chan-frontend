import { apiClient } from "../api";
import type { Board, GetBoardsResponse } from "./types";

export const boardService = {
  getBoards: async (): Promise<GetBoardsResponse> => {
    const res = await apiClient.get("/boards");
    return res.data;
  },

  getBoardBySlug: async (slug: string): Promise<Board> => {
    const res = await apiClient.get(`/boards/${slug}`);
    return res.data;
  },
};
