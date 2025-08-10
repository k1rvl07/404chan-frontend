import { apiClient } from "../api";
import type { GetUserBySessionKeyParams, UpdateNicknameParams, User } from "./types";

export const userService = {
  getUserBySessionKey: async (params: GetUserBySessionKeyParams): Promise<User> => {
    const res = await apiClient.get("/user", { params });
    return res.data;
  },
  updateNickname: async (params: UpdateNicknameParams): Promise<User> => {
    const res = await apiClient.patch("/user/nickname", params);
    return res.data;
  },
};
