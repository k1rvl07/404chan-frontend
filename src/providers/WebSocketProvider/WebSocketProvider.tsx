"use client";

import { useSessionStore } from "@/stores/useSessionStore";
import { env } from "@utils";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WebSocketContextType, WebSocketMessage, WebSocketProviderProps } from "./types";

const WS_URL = env.WS_URL;

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  send: () => {},
});

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { sessionKey } = useSessionStore();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (!sessionKey || socket) return;

    connectAttempts.current += 1;
    if (connectAttempts.current > 1) {
      return;
    }

    const url = `${WS_URL}?session_key=${sessionKey}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const _data: WebSocketMessage = JSON.parse(event.data);
      } catch (e) {
        console.error("Invalid message format", e);
      }
    };

    ws.onclose = (event) => {
      console.log("[WebSocket] Connection closed", event.code);
      setIsConnected(false);
      setSocket(null);
      connectAttempts.current = 0;

      if (event.code !== 1000 && event.code !== 1001) {
        reconnectTimeout.current = setTimeout(() => {
          setSocket((prev) => {
            if (!prev) connect();
            return prev;
          });
        }, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
    };

    setSocket(ws);

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.close();
    };
  }, [sessionKey, socket]);

  useEffect(() => {
    if (sessionKey && !socket) {
      connect();
    }
  }, [sessionKey, socket, connect]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close(1000, "Component unmounted");
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [socket]);

  const send = useCallback(
    (message: WebSocketMessage) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    },
    [socket],
  );

  const value = useMemo(() => ({ socket, isConnected, send }), [socket, isConnected, send]);

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export { WebSocketContext };
