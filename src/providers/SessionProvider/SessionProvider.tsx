"use client";

import { SplashScreen } from "@components";
import { ErrorScreen } from "@components";
import { useService } from "@hooks";
import { useSessionStore } from "@stores";
import type { WithChildren } from "@types";
import { useEffect, useState } from "react";

export const SessionProvider = ({ children }: WithChildren) => {
  const { sessionKey } = useSessionStore();

  const { data: createSessionResult, isError: createError } = useService("session", "createSession", undefined, {
    enabled: !sessionKey,
  });

  const { data: userData, isError: fetchError } = useService(
    "session",
    "getUserBySessionKey",
    sessionKey ? { session_key: sessionKey } : undefined,
    { enabled: !!sessionKey },
  );

  const [isMinDurationPassed, setIsMinDurationPassed] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinDurationPassed(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (createSessionResult || userData) {
      setHasSession(true);
      setHasError(false);
    }
  }, [createSessionResult, userData]);

  useEffect(() => {
    if (createError || fetchError) {
      setHasError(true);
    }
  }, [createError, fetchError]);

  useEffect(() => {
    if (createSessionResult) {
      useSessionStore.setState({
        sessionKey: createSessionResult.SessionKey,
        userId: createSessionResult.ID,
        nickname: createSessionResult.Nickname,
        createdAt: createSessionResult.CreatedAt,
      });
    }
  }, [createSessionResult]);

  useEffect(() => {
    if (userData && !createSessionResult) {
      useSessionStore.setState({
        userId: userData.ID,
        nickname: userData.Nickname,
        createdAt: userData.CreatedAt,
      });
    }
  }, [userData, createSessionResult]);

  if (hasError && isMinDurationPassed) {
    return <ErrorScreen />;
  }

  if (!(isMinDurationPassed && hasSession)) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
