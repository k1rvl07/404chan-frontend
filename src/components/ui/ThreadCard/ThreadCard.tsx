"use client";

import { AttachmentList, ImageModal } from "@components";
import type { Attachment } from "@types";
import { Clock, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import type { ThreadCardProps } from "./types";

export const ThreadCard = ({ thread, boardSlug }: ThreadCardProps) => {
  const [previewFile, setPreviewFile] = useState<Attachment | null>(null);

  const handlePreviewClick = (file: Attachment) => {
    setPreviewFile(file);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.closest(".no-navigate")) return;
    window.location.href = `/boards/${boardSlug}/threads/${thread.id}`;
  };

  return (
    <>
      <button
        type="button"
        className="w-full text-left border border-tw-light-divider dark:border-tw-dark-divider rounded-lg overflow-hidden bg-tw-light-background-paper dark:bg-tw-dark-background-paper hover:bg-tw-mono-50 dark:hover:bg-tw-mono-900 transition-colors duration-150 cursor-pointer"
        onClick={handleCardClick}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            window.location.href = `/boards/${boardSlug}/threads/${thread.id}`;
          }
        }}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-tw-mono-black dark:text-tw-mono-white line-clamp-2 break-words overflow-hidden">
            {thread.title}
          </h3>

          {thread.attachments && thread.attachments.length > 0 && (
            <div className="mt-3">
              <AttachmentList
                attachments={thread.attachments}
                onPreviewClick={handlePreviewClick}
                maxVisible={4}
                compact
              />
            </div>
          )}

          <p className="text-sm text-tw-light-text-primary dark:text-tw-dark-text-primary mt-2 line-clamp-3 break-words overflow-hidden">
            {thread.content}
          </p>

          <div className="flex flex-col lg:flex-row lg:gap-3 gap-1 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary mt-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <User size={14} className="text-xs" />
                {thread.author_nickname || "Аноним"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MessageCircle size={14} className="text-xs" />
                {thread.messages_count} {getMessagesCountText(thread.messages_count)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <Clock size={14} className="text-xs" />
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
        </div>
      </button>

      {previewFile && <ImageModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </>
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
