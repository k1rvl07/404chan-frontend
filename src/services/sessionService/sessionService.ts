import type { CreateSessionResponse } from "@types";
import { apiClient } from "../api";

export const sessionService = {
  createSession: async (): Promise<CreateSessionResponse> => {
    const res = await apiClient.post("/session");
    return res.data;
  },
};
