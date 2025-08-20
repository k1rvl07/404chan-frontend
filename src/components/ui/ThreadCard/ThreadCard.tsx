"use client";

import { ClockCircleOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import type { ThreadCardProps } from "./types";

export const ThreadCard = ({ thread }: ThreadCardProps) => {
  return (
    <Link
      href={`/boards/${thread.board_id}/threads/${thread.id}`}
      className="
                block 
                border border-tw-light-divider dark:border-tw-dark-divider 
                rounded-lg 
                overflow-hidden 
                bg-tw-light-background-paper dark:bg-tw-dark-background-paper
                hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900
                transition-colors duration-150
                p-4
            "
    >
      <h3
        className="
                text-lg 
                font-semibold 
                mb-2 
                text-tw-mono-black 
                dark:text-tw-mono-white 
                line-clamp-2 
                break-words 
                overflow-hidden
            "
      >
        {thread.title}
      </h3>

      <p
        className="
                text-sm 
                text-tw-light-text-primary 
                dark:text-tw-dark-text-primary 
                mb-3 
                line-clamp-3 
                break-words 
                overflow-hidden
            "
      >
        {thread.content}
      </p>

      <div className="flex flex-col lg:flex-row lg:gap-3 gap-1 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <UserOutlined className="text-xs" />
            {thread.authorNickname || "Аноним"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <MessageOutlined className="text-xs" />
            {thread.messages_count} {getMessagesCountText(thread.messages_count)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <ClockCircleOutlined className="text-xs" />
          {new Date(thread.created_at)
            .toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(".", "")}
        </div>
      </div>
    </Link>
  );
};

const getMessagesCountText = (count: number): string => {
  const remainder = count % 100;
  if (remainder >= 11 && remainder <= 19) {
    return "сообщений";
  }

  const lastDigit = count % 10;
  switch (lastDigit) {
    case 1:
      return "сообщение";
    case 2:
    case 3:
    case 4:
      return "сообщения";
    default:
      return "сообщений";
  }
};
