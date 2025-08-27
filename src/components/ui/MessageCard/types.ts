import type { Message } from "@types";

export type MessageCardProps = {
  message: Message;
  isReply?: boolean;
  onReplyClick?: (messageId: number) => void;
};
