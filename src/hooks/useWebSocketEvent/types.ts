export type WebSocketEventData = {
  event: string;
  user_id?: number;
  nickname?: string;
  timestamp?: number;
  [key: string]: unknown;
};

export type Handler = (data: WebSocketEventData) => void;
