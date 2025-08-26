export type WebSocketMessage = {
  event: string;
  [key: string]: unknown;
};

export type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (message: WebSocketMessage) => void;
  onMessage: (callback: (data: WebSocketMessage) => void) => () => void;
  offMessage: (callback: (data: WebSocketMessage) => void) => void;
};
