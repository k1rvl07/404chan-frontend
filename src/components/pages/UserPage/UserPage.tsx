// D:\Git_Projects\404chan\frontend\src\components\pages\UserPage\UserPage.tsx

"use client";

import { AppContainer, ErrorScreen, Loading } from "@components";
import { Button, Input } from "@components";
import { useService } from "@hooks";
import { useServiceMutation } from "@hooks";
import { useWebSocketEvent } from "@hooks";
import { useSessionStore } from "@stores";
import { useEffect, useState } from "react";
import type { AxiosError, User } from "./types";

export const UserPage = () => {
  const {
    sessionKey,
    userId,
    nickname,
    setNickname,
    nicknameChangeCooldownUntil,
    setNicknameChangeCooldownUntil,
    setLastNicknameUpdateServerTime,
  } = useSessionStore();

  const {
    data: userData,
    isLoading,
    isError: isProfileError,
  } = useService<"user", "getUserBySessionKey">(
    "user",
    "getUserBySessionKey",
    sessionKey ? { session_key: sessionKey } : undefined,
    { enabled: !!sessionKey },
  );

  const { data: cooldownData } = useService<"user", "getCooldown">(
    "user",
    "getCooldown",
    sessionKey ? { session_key: sessionKey } : undefined,
    { enabled: !!sessionKey },
  );

  const messagesCount = userData?.MessagesCount ?? 0;
  const threadsCount = userData?.ThreadsCount ?? 0;
  const [sessionDuration, setSessionDuration] = useState("00:00:00");
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Инициализация cooldown из данных, полученных от сервера
  useEffect(() => {
    if (cooldownData?.lastNicknameChangeUnix) {
      const serverTimestamp = cooldownData.lastNicknameChangeUnix;
      const cooldownEndMs = serverTimestamp * 1000 + 60000;

      // Проверяем, активен ли cooldown
      const now = Date.now();
      if (cooldownEndMs > now) {
        setLastNicknameUpdateServerTime(serverTimestamp);
        setNicknameChangeCooldownUntil(cooldownEndMs);
      }
    }
  }, [cooldownData, setLastNicknameUpdateServerTime, setNicknameChangeCooldownUntil]);

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
      const now = Math.floor(Date.now() / 1000);
      setNickname(data.Nickname);
      setNicknameChangeCooldownUntil(Date.now() + 60000);
      setLastNicknameUpdateServerTime(now);
      setIsEditing(false);
      setNicknameError(null);
    },
    onError: (err: unknown) => {
      let msg = "Не удалось изменить ник";

      if (err && typeof err === "object") {
        const axiosError = err as AxiosError;
        const status = axiosError.response?.status;

        if (status === 429) {
          const left = nicknameChangeCooldownUntil ? Math.ceil((nicknameChangeCooldownUntil - Date.now()) / 1000) : 60;
          msg = `Менять ник можно не чаще раза в минуту. Осталось: ${left} с.`;
        } else if (axiosError.response?.data?.error) {
          msg = axiosError.response.data.error;
        } else if (axiosError.message) {
          msg = axiosError.message;
        }
      }

      setNicknameError(msg);
    },
  });

  useWebSocketEvent("nickname_updated", (rawData) => {
    const data = rawData as { event: string; user_id: number; nickname: string; timestamp?: number };
    if (data.event === "nickname_updated" && data.user_id === userId && data.nickname !== nickname) {
      setNickname(data.nickname);
    }

    if (data.event === "nickname_updated" && data.timestamp) {
      const serverTimestamp = data.timestamp;
      const cooldownEndMs = serverTimestamp * 1000 + 60000;
      setNicknameChangeCooldownUntil(cooldownEndMs);
      setLastNicknameUpdateServerTime(serverTimestamp);
    }
  });

  useEffect(() => {
    if (!nicknameChangeCooldownUntil) {
      setIsCooldown(false);
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const left = Math.ceil((nicknameChangeCooldownUntil - now) / 1000);
      if (left > 0) {
        setIsCooldown(true);
        setTimeLeft(left);
      } else {
        setIsCooldown(false);
        setTimeLeft(0);
        setNicknameChangeCooldownUntil(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nicknameChangeCooldownUntil, setNicknameChangeCooldownUntil]);

  const handleNicknameChange = () => {
    const trimmed = newNickname.trim();
    if (!trimmed) {
      setNicknameError("Ник не может быть пустым");
      return;
    }
    if (trimmed.length > 16) {
      setNicknameError("Ник не может быть длиннее 16 символов");
      return;
    }
    if (isCooldown) {
      setNicknameError(`Менять ник можно не чаще раза в минуту. Осталось: ${timeLeft} с.`);
      return;
    }
    if (trimmed !== nickname && sessionKey) {
      updateNickname({
        session_key: sessionKey,
        nickname: trimmed,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitized = value.replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, "");
    if (sanitized.length <= 16) {
      setNewNickname(sanitized);
      setNicknameError(null);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNicknameChange();
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

  if (isLoading) {
    return <Loading />;
  }

  if (isProfileError) {
    return <ErrorScreen />;
  }

  return (
    <main className="min-h-screen">
      <AppContainer className="py-6">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-tw-mono-black dark:text-tw-mono-white">Профиль пользователя</h2>
          <ul className="space-y-4 text-tw-light-text-primary dark:text-tw-dark-text-primary">
            <li>
              <strong className="font-medium">ID:</strong> {userId}
            </li>
            <li>
              <strong className="font-medium">Ник:</strong>{" "}
              {isEditing ? (
                <span className="inline-flex flex-row items-center gap-2">
                  <Input
                    type="text"
                    value={newNickname}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    disabled={isCooldown}
                    placeholder="Ник (1-16)"
                    maxLength={16}
                    className="w-[140px] lg:w-[260px]"
                  />
                  <span className="text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                    {newNickname.length}/16
                  </span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      onClick={handleNicknameChange}
                      disabled={isCooldown || newNickname.trim().length === 0 || newNickname.trim().length > 16}
                      size="sm"
                    >
                      Сохранить
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setNewNickname(nickname);
                        setIsEditing(false);
                        setNicknameError(null);
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Отмена
                    </Button>
                  </div>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 ml-1">
                  {nickname}
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    изменить
                  </Button>
                </span>
              )}
            </li>
            {isCooldown && (
              <p className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                Можно будет изменить через {timeLeft} сек.
              </p>
            )}
            <p className="text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
              Ник может содержать только буквы и цифры
            </p>
            {nicknameError && <p className="text-tw-light-error dark:text-tw-dark-error text-sm">{nicknameError}</p>}
            <li>
              <strong className="font-medium">Дата создания аккаунта:</strong> {formatAccountCreatedAt()}
            </li>
            <li>
              <strong className="font-medium">Текущая сессия:</strong>{" "}
              <code className="font-mono text-sm text-tw-mono-900 dark:text-tw-mono-100">
                {sessionKey ? `${sessionKey.slice(0, 8)}...` : "Нет активной сессии"}
              </code>
            </li>
            <li>
              <strong className="font-medium">Продолжительность сессии:</strong>{" "}
              <span className="font-mono text-lg text-tw-mono-black dark:text-tw-mono-white">{sessionDuration}</span>
            </li>
            <li>
              <strong className="font-medium">Тредов:</strong> {threadsCount}
            </li>
            <li>
              <strong className="font-medium">Сообщений:</strong> {messagesCount}
            </li>
          </ul>
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
