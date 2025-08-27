"use client";
import { AppContainer, ErrorPage, ErrorScreen, Loading, ThreadCard } from "@components";
import { Button, Textarea } from "@components";
import { Pagination } from "@components";
import { useService, useServiceMutation } from "@hooks";
import { useWebSocketEvent } from "@hooks";
import { useSessionStore } from "@stores";
import { getErrorStatus } from "@utils";
import { notFound } from "next/navigation";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type { Thread } from "./types";

export const BoardPage = () => {
  const params = useParams();
  const router = useRouter();
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
    refetch: refetchThreads,
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
  >("thread", "createThread", {
    onSuccess: (data) => {
      const serverTimestamp = Math.floor(Date.now() / 1000);
      setLastThreadCreationServerTime(serverTimestamp);
      setThreadCreationCooldownUntil(Date.now() + 300000);
      router.push(`/boards/${slug}/threads/${data.id}`);
    },
    onError: (error) => {
      console.error("Failed to create thread:", error);
    },
  });

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
    if (data.event === "thread_created" && typeof data.timestamp === "number") {
      const serverTimestamp = data.timestamp;
      const cooldownEndMs = serverTimestamp * 1000 + 300000;
      setLastThreadCreationServerTime(serverTimestamp);
      setThreadCreationCooldownUntil(cooldownEndMs);
    }
  });

  useWebSocketEvent("message_created", (data) => {
    if (data.event === "message_created" && typeof data.thread_id === "number") {
      refetchThreads();
    }
  });

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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
        setThreadCreationCooldownUntil(null);
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
    await createThreadMutation.mutateAsync({
      board_id: board.id,
      title: threadTitle,
      content: threadContent,
    });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => handleSortChange("new")}
                    className={`px-4 py-2 relative hover:!bg-transparent ${
                      sort === "new"
                        ? "text-tw-mono-black dark:text-tw-mono-white"
                        : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
                    }`}
                  >
                    Новые
                    {sort === "new" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => handleSortChange("popular")}
                    className={`px-4 py-2 relative hover:!bg-transparent ${
                      sort === "popular"
                        ? "text-tw-mono-black dark:text-tw-mono-white"
                        : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
                    }`}
                  >
                    Популярные
                    {sort === "popular" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => handleSortChange("active")}
                    className={`px-4 py-2 relative hover:!bg-transparent ${
                      sort === "active"
                        ? "text-tw-mono-black dark:text-tw-mono-white"
                        : "text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
                    }`}
                  >
                    Активные
                    {sort === "active" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tw-mono-black dark:bg-tw-mono-white" />
                    )}
                  </Button>
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
                    <ThreadCard key={thread.id} thread={thread} boardSlug={board.slug} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={threadsData.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
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
