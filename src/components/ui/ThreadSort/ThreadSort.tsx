"use client";

import type { ThreadSortProps } from "./types";

export const ThreadSort = ({ currentSort, onChange }: ThreadSortProps) => {
  return (
    <div className="flex border-b border-tw-light-divider dark:border-tw-dark-divider">
      <button
        type="button"
        onClick={() => onChange("new")}
        className={`px-4 py-2 relative hover:!bg-transparent ${
          currentSort === "new"
            ? "text-tw-mono-black dark:text-tw-mono-white"
            : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
        }`}
      >
        Новые
        {currentSort === "new" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange("popular")}
        className={`px-4 py-2 relative hover:!bg-transparent ${
          currentSort === "popular"
            ? "text-tw-mono-black dark:text-tw-mono-white"
            : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
        }`}
      >
        Популярные
        {currentSort === "popular" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange("active")}
        className={`px-4 py-2 relative hover:!bg-transparent ${
          currentSort === "active"
            ? "text-tw-mono-black dark:text-tw-mono-white"
            : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
        }`}
      >
        Активные
        {currentSort === "active" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
        )}
      </button>
    </div>
  );
};
