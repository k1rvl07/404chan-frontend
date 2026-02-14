import { apiClient } from "../api";
import type {
  ConfirmFilesParams,
  ConfirmFilesResponse,
  DeleteTemporaryParams,
  DeleteTemporaryResponse,
  GetAttachmentsParams,
  GetAttachmentsResponse,
  UploadFilesParams,
  UploadFilesResponse,
} from "./types";

export const uploadService = {
  uploadFiles: async (params: UploadFilesParams): Promise<UploadFilesResponse> => {
    const formData = new FormData();
    for (const file of params.files) {
      formData.append("files", file);
    }

    const res = await apiClient.post<UploadFilesResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  confirmFiles: async (params: ConfirmFilesParams): Promise<ConfirmFilesResponse> => {
    const res = await apiClient.post<ConfirmFilesResponse>("/upload/confirm", {
      file_ids: params.file_ids,
    });

    return res.data;
  },

  getAttachments: async (params: GetAttachmentsParams): Promise<GetAttachmentsResponse> => {
    const res = await apiClient.get<GetAttachmentsResponse>("/attachments", {
      params: {
        thread_id: params.thread_id,
        message_id: params.message_id,
      },
    });

    return res.data;
  },

  deleteTemporary: async (params: DeleteTemporaryParams): Promise<DeleteTemporaryResponse> => {
    const res = await apiClient.delete<DeleteTemporaryResponse>("/attachments", {
      params: {
        file_id: params.file_id,
      },
    });

    return res.data;
  },
};
