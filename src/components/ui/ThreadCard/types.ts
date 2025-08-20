export type ThreadCardProps = {
  thread: Thread;
};

export type Thread = {
  id: number;
  board_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  authorNickname: string;
  messages_count: number;
};
