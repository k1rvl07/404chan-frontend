"use client";

import { AppContainer } from "@components";
import { useService } from "@hooks";
import { useServiceMutation } from "@hooks";
import { useWebSocketEvent } from "@hooks";
import { useSessionStore } from "@stores";
import { useEffect, useState } from "react";
import type { User, WebSocketEvent } from "./types";

export const UserPage = () => {
  const { sessionKey } = useSessionStore();
  const { data: userData } = useService<"user", "getUserBySessionKey">(
    "user",
    "getUserBySessionKey",
    sessionKey ? { session_key: sessionKey } : undefined,
    { enabled: !!sessionKey },
  );

  const { userId, nickname, setNickname } = useSessionStore();
  const messagesCount = userData?.MessagesCount ?? 0;
  const threadsCount = userData?.ThreadsCount ?? 0;

  const [sessionDuration, setSessionDuration] = useState("00:00:00");
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNewNickname(nickname);
  }, [nickname]);

  const { mutate: updateNickname } = useServiceMutation<
    "user",
    "updateNickname",
    { session_key: string; nickname: string },
    User
  >("user", "updateNickname", {
    onSuccess: (data) => {
      setNickname(data.Nickname);
      setIsEditing(false);
      setError(null);
    },
    onError: (err) => {
      let msg = "Не удалось изменить ник";

      if (err && typeof err === "object") {
        if ("response" in err) {
          const response = (err as { response?: { data?: { error?: string } } }).response;
          if (response?.data?.error) {
            msg = response.data.error;
          }
        } else if ("message" in err) {
          const message = (err as { message?: string }).message;
          if (typeof message === "string") {
            msg = message;
          }
        }
      }

      setError(msg);
    },
  });

  const handleNicknameChange = () => {
    const trimmed = newNickname.trim();

    if (!trimmed) {
      setError("Ник не может быть пустым");
      return;
    }

    if (trimmed.length > 16) {
      setError("Ник не может быть длиннее 16 символов");
      return;
    }

    setIsEditing(false);

    if (trimmed !== nickname && sessionKey) {
      updateNickname({
        session_key: sessionKey,
        nickname: trimmed,
      });
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    if (!userData?.SessionStartedAt) {
      setSessionDuration("00:00:00");
      return;
    }

    const updateDuration = () => {
      try {
        const start = new Date(userData.SessionStartedAt).getTime();
        const now = Date.now();
        const elapsed = now - start;
        const totalSeconds = Math.floor(elapsed / 1000);

        const hours = Math.floor(totalSeconds / 3600)
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((totalSeconds % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");

        setSessionDuration(`${hours}:${minutes}:${seconds}`);
      } catch {
        setSessionDuration("00:00:00");
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [userData?.SessionStartedAt]);

  const formatAccountCreatedAt = () => {
    if (!userData?.CreatedAt) return "Неизвестно";
    try {
      return new Date(userData.CreatedAt).toLocaleString();
    } catch {
      return "Неверный формат даты";
    }
  };

  useWebSocketEvent("nickname_updated", (rawData) => {
    const data = rawData as WebSocketEvent;
    if (data.event === "nickname_updated" && data.user_id === userId && data.nickname !== nickname) {
      setNickname(data.nickname);
    }
  });

  return (
    <main className="min-h-screen bg-tw-light-background-default dark:bg-tw-dark-background-default">
      <AppContainer className="py-6">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-tw-mono-black dark:text-tw-mono-white">Профиль пользователя</h2>

          <div className="space-y-4 text-tw-light-text-primary dark:text-tw-dark-text-primary">
            <div>
              <strong className="font-medium">ID:</strong> {userId}
            </div>

            <div>
              <strong className="font-medium">Ник:</strong>{" "}
              {isEditing ? (
                <span className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1 sm:mt-0">
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 16) {
                        setNewNickname(value);
                        setError(null);
                      }
                    }}
                    className="
                      px-2 py-1 text-sm border border-tw-light-divider dark:border-tw-dark-divider
                      rounded bg-tw-light-surface dark:bg-tw-dark-surface
                      focus:outline-none focus:ring-1 focus:ring-tw-mono-black dark:focus:ring-tw-mono-white
                      w-[140px] lg:w-[260px] font-mono
                    "
                    maxLength={16}
                    placeholder="Ник (1-16)"
                  />
                  <span className="text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary mt-1 sm:mt-0">
                    {newNickname.length}/16
                  </span>
                  <div className="flex gap-1 mt-1 sm:mt-0">
                    <button
                      type="button"
                      onClick={handleNicknameChange}
                      disabled={newNickname.trim().length === 0 || newNickname.trim().length > 16}
                      className="
                        px-2 py-1 text-xs bg-tw-mono-black dark:bg-tw-mono-white
                        text-white dark:text-black rounded hover:opacity-90
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewNickname(nickname);
                        setIsEditing(false);
                        setError(null);
                      }}
                      className="px-2 py-1 text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary"
                    >
                      Отмена
                    </button>
                  </div>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 ml-1">
                  {nickname}
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs underline hover:no-underline"
                  >
                    изменить
                  </button>
                </span>
              )}
            </div>

            {error && <p className="text-tw-light-error dark:text-tw-dark-error text-sm">{error}</p>}

            <div>
              <strong className="font-medium">Дата создания аккаунта:</strong> {formatAccountCreatedAt()}
            </div>

            <div>
              <strong className="font-medium">Текущая сессия:</strong>{" "}
              <code className="font-mono text-sm text-tw-mono-900 dark:text-tw-mono-100">
                {sessionKey ? `${sessionKey.slice(0, 8)}...` : "Нет активной сессии"}
              </code>
            </div>

            <div>
              <strong className="font-medium">Продолжительность сессии:</strong>{" "}
              <span className="font-mono text-lg text-tw-mono-black dark:text-tw-mono-white">{sessionDuration}</span>
            </div>

            <div>
              <strong className="font-medium">Сообщений:</strong> {messagesCount}
            </div>

            <div>
              <strong className="font-medium">Тредов:</strong> {threadsCount}
            </div>
          </div>

          <div className="mt-8 p-4 bg-tw-light-surface dark:bg-tw-dark-surface border border-tw-light-divider dark:border-tw-dark-divider rounded-lg text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
            <p className="leading-relaxed">
              <strong className="font-medium text-tw-mono-black dark:text-tw-mono-white">
                Ваша приватность — наш приоритет.
              </strong>{" "}
              Эта страница доступна только вам. Все данные отображаются в реальном времени и видны исключительно в вашем
              браузере. Никакие сведения не передаются третьим лицам.
            </p>
          </div>
        </section>
      </AppContainer>
    </main>
  );
};
