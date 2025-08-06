export type WebSocketEventName =
  | "message:new"
  | "message:delete"
  | "user:joined"
  | "user:left"
  | "error"
  | "ping"
  | "pong";

export type WebSocketMessageNew = {
  type: "text" | "image";
  content: string;
  userId: number;
  nickname: string;
  timestamp: number;
};

export type WebSocketUserJoined = {
  userId: number;
  nickname: string;
};

export type WebSocketError = {
  code: number;
  message: string;
};

export type WebSocketPing = {
  timestamp: number;
};

export type WebSocketPong = {
  latency: number;
};

export type WebSocketEventData = {
  "message:new": WebSocketMessageNew;
  "message:delete": { messageId: string };
  "user:joined": WebSocketUserJoined;
  "user:left": { userId: number };
  error: WebSocketError;
  ping: WebSocketPing;
  pong: WebSocketPong;
};

export type WebSocketData = WebSocketEventData[WebSocketEventName];

export type WebSocketMessage = {
  event: WebSocketEventName;
  data: WebSocketData;
  timestamp: number;
};

export type WebSocketEventHandler<T extends WebSocketEventName> = (
  data: WebSocketEventData[T],
  raw: { event: T; data: WebSocketEventData[T]; timestamp: number },
) => void;

export type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (message: WebSocketMessage) => void;
};

export type WebSocketProviderProps = {
  children: React.ReactNode;
};
