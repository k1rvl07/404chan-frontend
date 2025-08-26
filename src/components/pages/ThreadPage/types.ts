export type Message = {
  id: number;
  thread_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  author_nickname: string;
};
