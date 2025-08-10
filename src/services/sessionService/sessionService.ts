import { apiClient } from "../api";
import type { CreateSessionResponse } from "./types";

export const sessionService = {
  createSession: async (): Promise<CreateSessionResponse> => {
    const res = await apiClient.post("/session");
    return res.data;
  },
};
