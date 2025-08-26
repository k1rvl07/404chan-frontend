import { WebSocketContext } from "@providers";
import { useContext, useEffect } from "react";
import type { Handler, WebSocketEventData } from "./types";

export const useWebSocketEvent = (eventName: string, handler: Handler) => {
  const { onMessage } = useContext(WebSocketContext);

  useEffect(() => {
    const callback = (data: WebSocketEventData) => {
      if (data.event === eventName) {
        handler(data);
      }
    };

    const unsubscribe = onMessage(callback);

    return () => {
      unsubscribe();
    };
  }, [eventName, handler, onMessage]);
};
