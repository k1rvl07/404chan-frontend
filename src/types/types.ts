import type { ReactNode } from "react";

export type WithChildren<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  children?: ReactNode;
};

export type Message = {
  id: number;
  thread_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  author_nickname: string;
  is_author: boolean;
  attachments?: Attachment[];
};

export type User = {
  id: number;
  nickname: string;
  created_at: string;
  session_started_at: string;
  session_key: string;
  messages_count: number;
  threads_count: number;
};

export type CreateSessionResponse = {
  id: number;
  nickname: string;
  created_at: string;
  session_key: string;
};

export type Thread = {
  id: number;
  board_id: number;
  board_slug: string;
  title: string;
  content: string;
  created_by_session_id: number;
  author_nickname: string;
  messages_count: number;
  created_at: string;
  updated_at: string;
  attachments?: Attachment[];
};

export type Attachment = {
  id: string;
  file_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  content_type: string;
  object_name: string;
  created_at: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  content_type: string;
  object_name: string;
};

export type SortOption = "new" | "popular" | "active";

export type FileUploaderProps = {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  disabled?: boolean;
};

export type ImageModalProps = {
  file: Attachment | null;
  onClose: () => void;
};
