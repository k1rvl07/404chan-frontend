"use client";

import { AppContainer, ErrorScreen, Loading, MessageCard } from "@components";
import { Button, Textarea } from "@components";
import { Pagination } from "@components";
import { useService, useServiceMutation } from "@hooks";
import { useWebSocketEvent } from "@hooks";
import { useSessionStore } from "@stores";
import type { Message } from "@types";
import { getErrorStatus } from "@utils";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

export const ThreadPage = () => {
  const params = useParams();
  const threadId = params.thread_id as string;
  const [messageContent, setMessageContent] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyTo, setReplyTo] = useState<{ id: number; author: string } | null>(null);
  const [showAsAuthor, setShowAsAuthor] = useState(false);
  const [isThreadAuthor, setIsThreadAuthor] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    sessionKey,
    messageCreationCooldownUntil,
    setMessageCreationCooldownUntil,
    setLastMessageCreationServerTime,
  } = useSessionStore();

  const threadIdNumber = threadId ? Number.parseInt(threadId, 10) : null;
  const isValidThreadId = threadIdNumber !== null && !Number.isNaN(threadIdNumber);

  const {
    data: threadData,
    isLoading: isLoadingThread,
    isError: isThreadError,
    error: threadError,
  } = useService<"thread", "getThreadByID">(
    "thread",
    "getThreadByID",
    isValidThreadId ? { id: threadIdNumber } : undefined,
    {
      enabled: isValidThreadId,
    },
  );

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    refetch: refetchMessages,
  } = useService<"message", "getMessagesByThreadID">(
    "message",
    "getMessagesByThreadID",
    threadData?.id ? { thread_id: threadData.id, page: currentPage, limit: 20 } : undefined,
    {
      enabled: !!threadData?.id,
    },
  );

  const shouldFetchCooldown = !!sessionKey;
  const { data: cooldownData, isError: isCooldownError } = useService<"message", "getMessageCooldown">(
    "message",
    "getMessageCooldown",
    shouldFetchCooldown ? { session_key: sessionKey } : undefined,
    {
      enabled: shouldFetchCooldown,
    },
  );

  const shouldCheckAuthorship = !!sessionKey && !!threadData?.id;
  const {
    data: authorshipData,
    error: authorshipErrorFromHook,
    isError: isAuthorshipError,
  } = useService<"thread", "checkThreadAuthor">(
    "thread",
    "checkThreadAuthor",
    shouldCheckAuthorship
      ? {
          thread_id: threadData.id,
          session_key: sessionKey,
        }
      : undefined,
    {
      enabled: shouldCheckAuthorship,
    },
  );

  const createMessageMutation = useServiceMutation<
    "message",
    "createMessage",
    { thread_id: number; content: string; parent_id?: number | null; show_as_author: boolean },
    Message
  >("message", "createMessage", {
    onSuccess: (_data) => {
      const serverTimestamp = Math.floor(Date.now() / 1000);
      setLastMessageCreationServerTime(serverTimestamp);
      setMessageCreationCooldownUntil(Date.now() + 10000);
      setMessageContent("");
      setReplyTo(null);
      setShowAsAuthor(false);
      setCurrentPage(1);
    },
    onError: (error) => {
      console.error("Failed to create message:", error);
    },
  });

  useEffect(() => {
    if (isAuthorshipError) {
      console.error("Authorship check error:", authorshipErrorFromHook);
      setIsThreadAuthor(false);
    } else if (authorshipData) {
      setIsThreadAuthor(authorshipData.is_author);
    } else {
      setIsThreadAuthor(false);
    }
  }, [authorshipData, isAuthorshipError, authorshipErrorFromHook]);

  useEffect(() => {
    setShowAsAuthor(isThreadAuthor);
  }, [isThreadAuthor]);

  useEffect(() => {
    if (cooldownData?.lastMessageCreationUnix) {
      const serverTimestamp = cooldownData.lastMessageCreationUnix;
      const cooldownEndMs = serverTimestamp * 1000 + 10000;
      const now = Date.now();
      if (cooldownEndMs > now) {
        setLastMessageCreationServerTime(serverTimestamp);
        setMessageCreationCooldownUntil(cooldownEndMs);
      }
    }
  }, [cooldownData, setLastMessageCreationServerTime, setMessageCreationCooldownUntil]);

  useWebSocketEvent("message_created", (data) => {
    if (data.event === "message_created" && typeof data.timestamp === "number") {
      const serverTimestamp = data.timestamp;
      const cooldownEndMs = serverTimestamp * 1000 + 10000;
      const currentUserID = useSessionStore.getState().userId;
      if (data.user_id === currentUserID) {
        useSessionStore.getState().setLastMessageCreationServerTime(serverTimestamp);
        useSessionStore.getState().setMessageCreationCooldownUntil(cooldownEndMs);
        useSessionStore.getState().incrementMessagesCount();
      }
      refetchMessages();
    }
  });

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!messageCreationCooldownUntil) {
      setIsCooldown(false);
      setTimeLeft(0);
      return;
    }
    const updateTimer = () => {
      const now = Date.now();
      const left = Math.ceil((messageCreationCooldownUntil - now) / 1000);
      if (left > 0) {
        setIsCooldown(true);
        setTimeLeft(left);
      } else {
        setIsCooldown(false);
        setTimeLeft(0);
        setMessageCreationCooldownUntil(null);
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
  }, [messageCreationCooldownUntil, setMessageCreationCooldownUntil]);

  if (!isValidThreadId) {
    notFound();
  }

  const hasError =
    isThreadError ||
    isMessagesError ||
    (shouldCheckAuthorship && isAuthorshipError) ||
    (shouldFetchCooldown && isCooldownError);

  if (hasError) {
    const status = getErrorStatus(threadError || undefined);
    if (status === 404) {
      notFound();
    }
    return <ErrorScreen />;
  }

  const requiredDataLoaded = threadData != null && messagesData != null;
  const optionalDataLoaded =
    (!shouldCheckAuthorship || authorshipData != null) && (!shouldFetchCooldown || cooldownData != null);

  if (isLoadingThread || (threadData && isLoadingMessages) || !requiredDataLoaded || !optionalDataLoaded) {
    return <Loading />;
  }

  const handleCreateMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!(threadData && sessionKey) || messageContent.trim().length < 1) return;
    await createMessageMutation.mutateAsync({
      thread_id: threadData.id,
      content: messageContent,
      parent_id: replyTo?.id ?? null,
      show_as_author: isThreadAuthor && showAsAuthor,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReply = (messageId: number, author: string) => {
    setReplyTo({ id: messageId, author });
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setMessageContent("");
  };

  const toggleShowAsAuthor = () => {
    setShowAsAuthor((prev) => !prev);
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleShowAsAuthor();
    }
  };

  const handleSwitchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleShowAsAuthor();
    }
  };

  const renderReplyIndicator = () => {
    if (!replyTo) return null;
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-tw-light-surface dark:bg-tw-dark-surface border-b border-tw-light-divider dark:border-tw-dark-divider text-sm text-tw-light-text-primary dark:text-tw-dark-text-primary">
        <span>
          Ответ на сообщение <strong>#{replyTo.id}</strong>
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCancelReply}
          className="text-xs px-2 py-1 min-w-0"
          aria-label="Отменить ответ"
        >
          ✕
        </Button>
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      <AppContainer className="py-6">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-tw-mono-black dark:text-tw-mono-white">{threadData.title}</h2>
          <p className="text-tw-light-text-primary dark:text-tw-dark-text-primary leading-relaxed max-w-2xl">
            {threadData.content}
          </p>
          <div className="mt-6 space-y-2 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
            <div>
              <strong className="font-medium">Автор:</strong> {threadData.author_nickname || "Аноним"}
            </div>
            <div>
              <strong className="font-medium">Создан:</strong>{" "}
              {new Date(threadData.created_at).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div>
              <strong className="font-medium">Сообщений в треде:</strong> {messagesData?.pagination?.total ?? 0}
            </div>
          </div>
          <div className="border-t border-tw-light-divider dark:border-tw-dark-divider my-8" />
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-tw-mono-black dark:text-tw-mono-white mb-4">Сообщения</h3>
            <div className="p-4 border border-tw-light-divider dark:border-tw-dark-divider rounded-lg bg-tw-light-background-paper dark:bg-tw-dark-background-paper mb-6">
              <form onSubmit={handleCreateMessage}>
                {renderReplyIndicator()}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="space-y-1">
                    <Textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder={replyTo ? "Текст ответа..." : "Сообщение (1-9999)"}
                      maxLength={9999}
                      disabled={isCooldown}
                      minRows={3}
                      maxRows={6}
                      label="Сообщение"
                      helperText={`${messageContent.length}/9999`}
                    />
                  </div>

                  {isThreadAuthor && (
                    <div className="flex items-center gap-3 text-sm">
                      <label
                        htmlFor="show-as-author"
                        className="cursor-pointer text-tw-light-text-primary dark:text-tw-dark-text-primary select-none"
                        onClick={toggleShowAsAuthor}
                        onKeyDown={handleLabelKeyDown}
                        aria-checked={showAsAuthor}
                      >
                        Показать как автора
                      </label>
                      <div
                        onClick={toggleShowAsAuthor}
                        onKeyDown={handleSwitchKeyDown}
                        tabIndex={0}
                        role="switch"
                        aria-checked={showAsAuthor}
                        className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out
                          ${
                            showAsAuthor
                              ? "bg-tw-mono-900 dark:bg-tw-mono-100 border-tw-mono-900 dark:border-tw-mono-100"
                              : "bg-tw-mono-300 dark:bg-tw-mono-700 border-tw-mono-300 dark:border-tw-mono-700"
                          }`}
                        aria-label="Показать сообщение как автор треда"
                      >
                        <span
                          aria-hidden="true"
                          className={`inline-block h-5 w-5 transform rounded-full bg-tw-mono-white dark:bg-tw-mono-900 shadow transition-transform duration-200 ease-in-out
                            ${showAsAuthor ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </div>
                      <input
                        id="show-as-author"
                        type="checkbox"
                        className="sr-only"
                        checked={showAsAuthor}
                        onChange={() => {}}
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 justify-between items-center">
                    {isCooldown && (
                      <div className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                        Отправить сообщение можно через {timeLeft} сек.
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isCooldown || messageContent.trim().length < 1 || createMessageMutation.isPending}
                      size="md"
                      className="w-full lg:w-auto"
                    >
                      {createMessageMutation.isPending ? "Отправка..." : "Отправить"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            {isLoadingMessages ? (
              <Loading />
            ) : messagesData && messagesData.messages.length > 0 ? (
              <div className="space-y-4">
                {messagesData.messages.map((message) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    onReplyClick={(messageId) => handleReply(messageId, message.author_nickname || "Аноним")}
                  />
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={messagesData.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <div className="text-center py-8 bg-tw-light-surface dark:bg-tw-dark-surface border border-tw-light-divider dark:border-tw-dark-divider rounded text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                <p>Пока нет сообщений. Напишите первым!</p>
              </div>
            )}
          </div>
        </section>
      </AppContainer>
    </main>
  );
};
