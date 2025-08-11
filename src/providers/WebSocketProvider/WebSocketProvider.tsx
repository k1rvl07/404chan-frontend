"use client";
import { useSessionStore } from "@/stores/useSessionStore";
import { env } from "@utils";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WebSocketContextType, WebSocketMessage } from "./types";

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  send: () => {},
  onMessage: () => {},
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { sessionKey } = useSessionStore();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageHandlers = useRef<Array<(data: WebSocketMessage) => void>>([]);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.onopen = null;
      socketRef.current.onmessage = null;
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;

      if (socketRef.current.readyState !== WebSocket.CLOSED) {
        socketRef.current.close(1000, "Cleanup");
      }
      socketRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!sessionKey) return;

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    cleanupSocket();

    const url = `${env.WS_URL}?session_key=${sessionKey}`;
    const ws = new WebSocket(url);

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        for (const handler of messageHandlers.current) {
          handler(data);
        }

        if (data.event === "nickname_updated" && typeof data.timestamp === "number") {
          const cooldownEndMs = data.timestamp * 1000 + 60000;
          useSessionStore.getState().setLastNicknameUpdateServerTime(data.timestamp);
          useSessionStore.getState().setNicknameChangeCooldownUntil(cooldownEndMs);
        }
      } catch {
        console.error("[WebSocket] Invalid message format");
      }
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      socketRef.current = null;
      messageHandlers.current = [];

      if (event.code === 1000 || event.code === 1001) return;

      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(() => connect(), 3000);
    };

    ws.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
    };

    socketRef.current = ws;
  }, [sessionKey, cleanupSocket]);

  useEffect(() => {
    if (sessionKey) connect();

    return () => {
      cleanupSocket();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [sessionKey, connect, cleanupSocket]);

  const send = useCallback((message: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("[WebSocket] Not connected, message not sent:", message);
    }
  }, []);

  const onMessage = useCallback((callback: (data: WebSocketMessage) => void) => {
    messageHandlers.current.push(callback);
  }, []);

  const value = useMemo(
    () => ({ socket: socketRef.current, isConnected, send, onMessage }),
    [isConnected, send, onMessage],
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
