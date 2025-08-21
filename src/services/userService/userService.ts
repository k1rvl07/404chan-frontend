import { apiClient } from "../api";
import type { GetCooldownResponse, GetUserBySessionKeyParams, UpdateNicknameParams, User } from "./types";

export const userService = {
  getUserBySessionKey: async (params: GetUserBySessionKeyParams): Promise<User> => {
    const res = await apiClient.get("/user", { params });
    return res.data;
  },
  updateNickname: async (params: UpdateNicknameParams): Promise<User> => {
    const res = await apiClient.patch("/user/nickname", params);
    return res.data;
  },
  getCooldown: async (params: GetUserBySessionKeyParams): Promise<GetCooldownResponse> => {
    const res = await apiClient.get("/user/cooldown", { params });
    return res.data;
  },
};
