import type { Attachment, UploadedFile } from "@types";

export type UploadFilesParams = {
  files: File[];
};

export type UploadFilesResponse = UploadedFile[];

export type ConfirmFilesParams = {
  file_ids: string[];
};

export type ConfirmFilesResponse = {
  files: UploadedFile[];
};

export type GetAttachmentsParams = {
  thread_id?: number;
  message_id?: number;
};

export type GetAttachmentsResponse = Attachment[];

export type DeleteTemporaryParams = {
  file_id: string;
};

export type DeleteTemporaryResponse = {
  success: boolean;
};
