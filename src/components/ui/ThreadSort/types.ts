import type { SortOption } from "@types";

export type ThreadSortProps = {
  currentSort: SortOption;
  onChange: (sort: SortOption) => void;
};
