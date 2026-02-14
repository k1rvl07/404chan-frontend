"use client";

import { SplashScreen } from "@components";
import { ErrorScreen } from "@components";
import { useService } from "@hooks";
import { useSessionStore } from "@stores";
import type { WithChildren } from "@types";
import { useEffect, useState } from "react";

export const SessionProvider = ({ children }: WithChildren) => {
  const { sessionKey, nickname, sessionStartedAt } = useSessionStore();

  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasUserData, setHasUserData] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isHydrated) {
      useSessionStore.persist.rehydrate();
      setIsHydrated(true);
    }
  }, [isClient, isHydrated]);

  useEffect(() => {
    if (isHydrated && nickname) {
      setHasUserData(true);
    }
  }, [isHydrated, nickname]);

  const { data: createSessionResult, isError: createSessionError } = useService("session", "createSession", undefined, {
    enabled: isClient && isHydrated && !sessionKey,
    retry: 0,
  });

  const {
    data: userData,
    isError: fetchError,
    isLoading: isUserLoading,
  } = useService("user", "getUserBySessionKey", sessionKey ? { session_key: sessionKey } : undefined, {
    enabled: isClient && isHydrated && !!sessionKey && !(nickname && sessionStartedAt),
    retry: 1,
  });

  useEffect(() => {
    if (createSessionError || fetchError) {
      setHasError(true);
    }
  }, [createSessionError, fetchError]);

  useEffect(() => {
    if (createSessionResult) {
      useSessionStore.setState({
        sessionKey: createSessionResult.session_key,
        userId: createSessionResult.id,
        nickname: createSessionResult.nickname,
        createdAt: createSessionResult.created_at,
        sessionStartedAt: createSessionResult.created_at,
      });
    }
  }, [createSessionResult]);

  useEffect(() => {
    if (userData && sessionKey) {
      useSessionStore.setState({
        userId: userData.id,
        nickname: userData.nickname,
        createdAt: userData.created_at,
        sessionStartedAt: userData.session_started_at,
      });
    }
  }, [userData, sessionKey]);

  useEffect(() => {
    if (!(isClient && isHydrated)) return;

    const unsub = useSessionStore.subscribe((state) => {
      localStorage.setItem(
        "404chan-session",
        JSON.stringify({
          state: {
            sessionKey: state.sessionKey,
            userId: state.userId,
            nickname: state.nickname,
            createdAt: state.createdAt,
            sessionStartedAt: state.sessionStartedAt,
            nicknameChangeCooldownUntil: state.nicknameChangeCooldownUntil,
            lastNicknameUpdateServerTime: state.lastNicknameUpdateServerTime,
            threadCreationCooldownUntil: state.threadCreationCooldownUntil,
            lastThreadCreationServerTime: state.lastThreadCreationServerTime,
            messageCreationCooldownUntil: state.messageCreationCooldownUntil,
            lastMessageCreationServerTime: state.lastMessageCreationServerTime,
            messagesCount: state.messagesCount,
            threadsCount: state.threadsCount,
          },
          version: 0,
        }),
      );
    });

    return unsub;
  }, [isClient, isHydrated]);

  if (!isClient) {
    return null;
  }

  if (hasError) {
    return <ErrorScreen />;
  }

  if (!isHydrated) {
    return null;
  }

  if (!(sessionKey || createSessionResult)) {
    return <SplashScreen />;
  }

  if (!(nickname || hasUserData || isUserLoading)) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
