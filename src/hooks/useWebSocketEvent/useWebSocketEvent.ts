import { WebSocketContext } from "@providers";
import { useContext, useEffect } from "react";
import type { Handler, WebSocketEventData } from "./types";

export const useWebSocketEvent = (eventName: string, handler: Handler) => {
  const { onMessage } = useContext(WebSocketContext);

  useEffect(() => {
    const callback = (data: WebSocketEventData) => {
      console.log("[WebSocket] Received event:", data);
      if (data.event === eventName) {
        console.log(`[WebSocket] Matched event: ${eventName}`, data);
        handler(data);
      }
    };

    onMessage(callback);

    return () => {};
  }, [eventName, handler, onMessage]);
};
