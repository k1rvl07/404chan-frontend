import type { Message } from "@types";
import { apiClient } from "../api";
import type {
  CreateMessageParams,
  GetMessageByThreadIDParams,
  GetMessageByThreadIDResponse,
  GetMessageCooldownParams,
  GetMessageCooldownResponse,
} from "./types";

export const messageService = {
  createMessage: async (params: CreateMessageParams): Promise<Message> => {
    const res = await apiClient.post(
      `/messages/${params.thread_id}`,
      {
        content: params.content,
        parent_id: params.parent_id,
        show_as_author: params.show_as_author,
        attachment_ids: params.attachment_ids,
      },
      {
        params: { session_key: params.session_key },
      },
    );
    return res.data;
  },
  getMessagesByThreadID: async (params: GetMessageByThreadIDParams): Promise<GetMessageByThreadIDResponse> => {
    const res = await apiClient.get(`/messages/${params.thread_id}`, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    return res.data;
  },
  getMessageCooldown: async (params: GetMessageCooldownParams): Promise<GetMessageCooldownResponse> => {
    const res = await apiClient.get("/messages/cooldown", {
      params: { session_key: params.session_key },
    });
    return res.data;
  },
  getMessageByID: async ({ id }: { id: number }): Promise<Message> => {
    const res = await apiClient.get(`/messages/message/${id}`);
    return res.data;
  },
};
