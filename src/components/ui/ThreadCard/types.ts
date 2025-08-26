export type ThreadCardProps = {
  thread: {
    id: number;
    board_id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    author_nickname: string;
    messages_count: number;
  };
  boardSlug: string;
};
