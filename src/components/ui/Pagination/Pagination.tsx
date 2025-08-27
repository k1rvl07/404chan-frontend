import { Button } from "@components";
import type { PaginationProps } from "./types";

export const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center mt-6 ${className}`}>
      <div className="block lg:hidden">
        <nav className="inline-flex rounded-md">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-r-none"
          >
            Предыдущая
          </Button>
          <Button type="button" variant="primary" size="md" disabled className="rounded-none min-w-0 px-4">
            {currentPage}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-l-none"
          >
            Следующая
          </Button>
        </nav>
      </div>

      <div className="hidden lg:block">
        <nav className="inline-flex rounded-md shadow">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-r-none"
          >
            Предыдущая
          </Button>
          {renderDesktopPages(currentPage, totalPages, onPageChange)}
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-l-none"
          >
            Следующая
          </Button>
        </nav>
      </div>
    </div>
  );
};

function renderDesktopPages(currentPage: number, totalPages: number, onPageChange: (page: number) => void) {
  const pages: (number | -1)[] = [];
  const maxVisiblePages = 5;

  pages.push(1);

  let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);

  if (endPage - startPage < maxVisiblePages - 2) {
    startPage = Math.max(2, endPage - (maxVisiblePages - 2));
  }

  const leftEllipsisKey = `ellipsis-${totalPages}-${currentPage}-left`;
  const rightEllipsisKey = `ellipsis-${totalPages}-${currentPage}-right`;

  if (startPage > 2) {
    pages.push(-1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push(-1);
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages.map((pageNum, index) =>
    pageNum === -1 ? (
      <span
        key={startPage > 2 && index === pages.indexOf(-1) ? leftEllipsisKey : rightEllipsisKey}
        className="relative inline-flex items-center px-4 py-2 border border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-surface dark:bg-tw-dark-surface text-sm font-medium text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
      >
        ...
      </span>
    ) : (
      <Button
        key={pageNum}
        type="button"
        variant={pageNum === currentPage ? "primary" : "secondary"}
        size="md"
        onClick={() => onPageChange(pageNum)}
        className={pageNum === currentPage ? "rounded-none" : "rounded-none"}
      >
        {pageNum}
      </Button>
    ),
  );
}
