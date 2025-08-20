"use client";

import { AppContainer, ErrorPage, ErrorScreen, Loading, ThreadCard } from "@components";
import { Button, Textarea } from "@components";
import { useService, useServiceMutation } from "@hooks";
import { useWebSocketEvent } from "@hooks";
import { useSessionStore } from "@stores";
import { getErrorStatus } from "@utils";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type { Thread } from "./types";

export const BoardPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [sort, setSort] = useState("new");
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { threadCreationCooldownUntil, setThreadCreationCooldownUntil, setLastThreadCreationServerTime, sessionKey } =
    useSessionStore();

  const {
    data: board,
    isLoading: isLoadingBoard,
    isError: isBoardError,
    error: boardError,
  } = useService<"board", "getBoardBySlug">("board", "getBoardBySlug", slug, {
    enabled: !!slug,
  });

  const {
    data: threadsData,
    isLoading: isLoadingThreads,
    isError: isThreadsError,
  } = useService<"thread", "getThreadsByBoardID">(
    "thread",
    "getThreadsByBoardID",
    board?.id ? { board_id: board.id, sort, page: currentPage, limit: 10 } : undefined,
    {
      enabled: !!board?.id,
    },
  );

  const { data: cooldownData, isError: isCooldownError } = useService<"thread", "getThreadCooldown">(
    "thread",
    "getThreadCooldown",
    sessionKey ? { session_key: sessionKey } : undefined,
    {
      enabled: !!sessionKey,
    },
  );

  const createThreadMutation = useServiceMutation<
    "thread",
    "createThread",
    { board_id: number; title: string; content: string },
    Thread
  >("thread", "createThread");

  useEffect(() => {
    if (cooldownData?.lastThreadCreationUnix) {
      const serverTimestamp = cooldownData.lastThreadCreationUnix;
      const cooldownEndMs = serverTimestamp * 1000 + 300000;

      const now = Date.now();
      if (cooldownEndMs > now) {
        setLastThreadCreationServerTime(serverTimestamp);
        setThreadCreationCooldownUntil(cooldownEndMs);
      }
    }
  }, [cooldownData, setLastThreadCreationServerTime, setThreadCreationCooldownUntil]);

  useWebSocketEvent("thread_created", (data) => {
    if (data.event === "thread_created" && data.timestamp) {
      const serverTimestamp = data.timestamp;
      const cooldownEndMs = serverTimestamp * 1000 + 300000;
      setLastThreadCreationServerTime(serverTimestamp);
      setThreadCreationCooldownUntil(cooldownEndMs);
    }
  });

  useEffect(() => {
    if (!threadCreationCooldownUntil) {
      setIsCooldown(false);
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const left = Math.ceil((threadCreationCooldownUntil - now) / 1000);

      if (left > 0) {
        setIsCooldown(true);
        setTimeLeft(left);
      } else {
        setIsCooldown(false);
        setTimeLeft(0);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [threadCreationCooldownUntil]);

  useEffect(() => {
    if (threadCreationCooldownUntil) {
      const now = Date.now();
      const left = Math.ceil((threadCreationCooldownUntil - now) / 1000);

      if (left <= 0) {
        setThreadCreationCooldownUntil(null);
      }
    }
  }, [threadCreationCooldownUntil, setThreadCreationCooldownUntil]);

  if (isBoardError || isThreadsError || isCooldownError) {
    const status = getErrorStatus(boardError || undefined);
    if (status === 404) {
      notFound();
    }
    return <ErrorScreen />;
  }

  if (isLoadingBoard) {
    return <Loading />;
  }

  if (!board) {
    return <ErrorPage title="404" message="Доска не найдена" />;
  }

  const handleCreateThread = async (e: FormEvent) => {
    e.preventDefault();
    if (!(board && sessionKey) || threadTitle.trim().length < 3 || threadContent.trim().length < 3) return;

    try {
      const newThread = await createThreadMutation.mutateAsync({
        board_id: board.id,
        title: threadTitle,
        content: threadContent,
      });

      const now = Math.floor(Date.now() / 1000);
      setLastThreadCreationServerTime(now);
      setThreadCreationCooldownUntil(now * 1000 + 300000);

      window.location.href = `/boards/${board.id}/threads/${newThread.id}`;
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderMobilePagination = () => {
    if (!threadsData?.pagination) return null;

    const { page, totalPages } = threadsData.pagination;

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-surface dark:bg-tw-dark-surface text-sm font-medium text-tw-light-text-secondary dark:text-tw-dark-text-secondary hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Предыдущая
          </button>
          <button
            type="button"
            onClick={() => {}}
            className="relative inline-flex items-center px-4 py-2 border-y border-tw-light-divider dark:border-tw-dark-divider bg-tw-mono-black dark:bg-tw-mono-white text-tw-mono-white dark:text-tw-mono-black text-sm font-medium"
          >
            {page}
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-surface dark:bg-tw-dark-surface text-sm font-medium text-tw-light-text-secondary dark:text-tw-dark-text-secondary hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Следующая
          </button>
        </nav>
      </div>
    );
  };

  const renderDesktopPagination = () => {
    if (!threadsData?.pagination) return null;

    const { page, totalPages } = threadsData.pagination;

    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    pages.push(1);

    let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);

    if (endPage - startPage < maxVisiblePages - 2) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 2));
    }

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

    return (
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md shadow">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-surface dark:bg-tw-dark-surface text-sm font-medium text-tw-light-text-secondary dark:text-tw-dark-text-secondary hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Предыдущая
          </button>

          {pages.map((pageNum) =>
            pageNum === -1 ? (
              <span
                key="ellipsis"
                className="relative inline-flex items-center px-4 py-2 border border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-surface dark:bg-tw-dark-surface text-sm font-medium text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 border border-tw-light-divider dark:border-tw-dark-divider text-sm font-medium ${
                  pageNum === page
                    ? "bg-tw-mono-black dark:bg-tw-mono-white text-tw-mono-white dark:text-tw-mono-black"
                    : "bg-tw-light-surface dark:bg-tw-dark-surface text-tw-light-text-secondary dark:text-tw-dark-text-secondary hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900"
                }`}
              >
                {pageNum}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-tw-light-divider dark:border-tw-dark-divider bg-tw-light-surface dark:bg-tw-dark-surface text-sm font-medium text-tw-light-text-secondary dark:text-tw-dark-text-secondary hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Следующая
          </button>
        </nav>
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      <AppContainer className="py-6">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-tw-mono-black dark:text-tw-mono-white">{board.title}</h2>

          {board.description ? (
            <p className="text-tw-light-text-primary dark:text-tw-dark-text-primary leading-relaxed max-w-2xl">
              {board.description}
            </p>
          ) : (
            <p className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary italic">
              Описание отсутствует
            </p>
          )}

          <div className="mt-6 space-y-2 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
            <div>
              <strong className="font-medium">Slug:</strong>{" "}
              <code className="font-mono bg-tw-light-surface dark:bg-tw-dark-surface px-1.5 py-0.5 rounded border border-tw-light-divider dark:border-tw-dark-divider">
                {board.slug}
              </code>
            </div>
            <div>
              <strong className="font-medium">Создана:</strong>{" "}
              {new Date(board.created_at).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="border-t border-tw-light-divider dark:border-tw-dark-divider my-8" />

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-tw-mono-black dark:text-tw-mono-white mb-4">Треды</h3>

              <div className="mb-6">
                <div className="flex border-b border-tw-light-divider dark:border-tw-dark-divider">
                  <button
                    type="button"
                    onClick={() => handleSortChange("new")}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      sort === "new"
                        ? "text-tw-mono-black dark:text-tw-mono-white"
                        : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
                    }`}
                  >
                    Новые
                    {sort === "new" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange("popular")}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      sort === "popular"
                        ? "text-tw-mono-black dark:text-tw-mono-white"
                        : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
                    }`}
                  >
                    Популярные
                    {sort === "popular" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange("active")}
                    className={`px-4 py-2 text-sm font-medium relative ${
                      sort === "active"
                        ? "text-tw-mono-black dark:text-tw-mono-white"
                        : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
                    }`}
                  >
                    Активные
                    {sort === "active" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 border border-tw-light-divider dark:border-tw-dark-divider rounded-lg bg-tw-light-background-paper dark:bg-tw-dark-background-paper mb-6">
                <form onSubmit={handleCreateThread}>
                  <div className="flex flex-col gap-3">
                    <div className="space-y-1">
                      <Textarea
                        value={threadTitle}
                        onChange={(e) => setThreadTitle(e.target.value)}
                        placeholder="Название (3-99)"
                        maxLength={99}
                        disabled={isCooldown}
                        minRows={1}
                        maxRows={2}
                        label="Название"
                        helperText={`${threadTitle.length}/99`}
                      />
                    </div>

                    <div className="space-y-1">
                      <Textarea
                        value={threadContent}
                        onChange={(e) => setThreadContent(e.target.value)}
                        placeholder="Описание (3-999)"
                        maxLength={999}
                        disabled={isCooldown}
                        minRows={3}
                        maxRows={6}
                        label="Описание"
                        helperText={`${threadContent.length}/999`}
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 justify-between items-center">
                      {isCooldown && (
                        <div className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                          Создать новый тред можно через {timeLeft} сек.
                        </div>
                      )}
                      <Button
                        type="submit"
                        disabled={
                          isCooldown ||
                          threadTitle.trim().length < 3 ||
                          threadContent.trim().length < 3 ||
                          createThreadMutation.isPending
                        }
                        size="md"
                        className="w-full lg:w-auto"
                      >
                        {createThreadMutation.isPending ? "Создание..." : "Создать тред"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {isLoadingThreads ? (
              <Loading />
            ) : threadsData && threadsData.threads.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {threadsData.threads.map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                </div>
                <div className="block lg:hidden">{renderMobilePagination()}</div>
                <div className="hidden lg:block">{renderDesktopPagination()}</div>
              </div>
            ) : (
              <div className="text-center py-8 bg-tw-light-surface dark:bg-tw-dark-surface border border-tw-light-divider dark:border-tw-dark-divider rounded text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                <p>Пока нет тредов. Создайте первый!</p>
              </div>
            )}
          </div>
        </section>
      </AppContainer>
    </main>
  );
};
