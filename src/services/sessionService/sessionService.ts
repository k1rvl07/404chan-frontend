import { apiClient } from "../api";
import type { CreateSessionResponse, GetSessionUserParams, User } from "./types";

export const sessionService = {
  createSession: async (): Promise<CreateSessionResponse> => {
    const res = await apiClient.post("/session");
    const data = res.data;

    if (!data.SessionKey) {
      throw new Error("Invalid session response: SessionKey missing");
    }

    return {
      ...data,
      SessionKey: data.SessionKey,
    };
  },

  getUserBySessionKey: async (params: GetSessionUserParams): Promise<User> => {
    const res = await apiClient.get("/session/user", {
      params: { session_key: params.session_key },
    });
    const data = res.data;

    return {
      ...data,
      SessionKey: data.SessionKey || params.session_key,
    };
  },
};
