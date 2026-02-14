export type Board = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type GetBoardsResponse = {
  boards: Board[];
};
