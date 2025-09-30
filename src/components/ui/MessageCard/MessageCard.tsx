"use client";
import { ClockCircleOutlined, CloseOutlined, MessageOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { AppContainer, Button } from "@components";
import { useService } from "@hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MessageCardProps } from "./types";

export const MessageCard = ({ message, isReply = false, onReplyClick }: MessageCardProps) => {
  const [showModal, setShowModal] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(".", "");
  };

  const getReplyText = () => {
    if (message.parent_id !== null && message.parent_id !== undefined) {
      return (
        <span>
          Ответ на сообщение{" "}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              message.parent_id !== null && message.parent_id !== undefined && setShowModal(message.parent_id)
            }
            className="text-tw-light-text-link dark:text-tw-dark-text-link font-medium hover:underline cursor-pointer p-0 h-auto hover:!bg-transparent"
          >
            #{message.parent_id}
          </Button>
        </span>
      );
    }
    return null;
  };

  const replyText = getReplyText();

  const {
    data: parentMessage,
    isLoading: isParentLoading,
    isError: isParentError,
  } = useService<"message", "getMessageByID">("message", "getMessageByID", showModal ? { id: showModal } : undefined, {
    enabled: !!showModal,
  });

  const closeModal = useCallback(() => {
    setShowModal(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showModal, closeModal]);

  return (
    <>
      <div
        ref={cardRef}
        className={`border border-tw-light-divider dark:border-tw-dark-divider rounded-lg overflow-hidden 
          ${isReply ? "ml-4 lg:ml-8 border-l-2 border-tw-mono-black dark:border-tw-mono-white" : ""}
          bg-tw-light-background-paper dark:bg-tw-dark-background-paper
          p-4 mb-4
          transition-colors duration-150
        `}
      >
        {replyText && (
          <div className="mb-2 text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary flex items-center">
            <MessageOutlined className="text-xs mr-1" />
            {replyText}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="flex items-center gap-1 text-sm text-tw-light-text-primary dark:text-tw-dark-text-primary">
            <UserOutlined className="text-xs" />
            {message.author_nickname || "Аноним"}
          </span>
          {message.is_author && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium 
              bg-tw-mono-100 dark:bg-tw-mono-800 
              border border-tw-mono-300 dark:border-tw-mono-700
              text-tw-mono-900 dark:text-tw-mono-50
              rounded-full
              shadow-sm
              transition-colors duration-150"
            >
              <StarOutlined className="text-xs" />
              Автор
            </span>
          )}
          <span className="text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
            ID: #{message.id}
          </span>
        </div>
        <div className="text-sm text-tw-light-text-primary dark:text-tw-dark-text-primary break-words whitespace-pre-wrap leading-relaxed mb-3">
          {message.content}
        </div>
        <div className="flex flex-wrap items-center justify-between text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary gap-y-2">
          <div className="flex items-center gap-1">
            <ClockCircleOutlined className="text-xs" />
            {formatDate(message.created_at)}
          </div>
          {onReplyClick && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onReplyClick(message.id)}
              className="text-xs px-2 py-1 min-w-0"
            >
              <MessageOutlined className="text-xs mr-1" />
              Ответить
            </Button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <AppContainer>
            <div
              ref={modalRef}
              className="bg-tw-light-background-paper dark:bg-tw-dark-background-paper rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b border-tw-light-divider dark:border-tw-dark-divider">
                <h4 className="font-semibold text-tw-mono-black dark:text-tw-mono-white">Сообщение #{showModal}</h4>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Закрыть"
                >
                  <CloseOutlined className="text-sm" />
                </Button>
              </div>
              {isParentLoading ? (
                <div className="p-6 text-center text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                  Загрузка...
                </div>
              ) : isParentError ? (
                <div className="p-6 text-center text-sm text-tw-light-error dark:text-tw-dark-error">
                  Не удалось загрузить сообщение
                </div>
              ) : parentMessage ? (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-sm text-tw-light-text-primary dark:text-tw-dark-text-primary">
                      <UserOutlined className="text-xs" />
                      {parentMessage.author_nickname || "Аноним"}
                    </span>
                    {parentMessage.is_author && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium 
        bg-tw-mono-100 dark:bg-tw-mono-800 
        border border-tw-mono-300 dark:border-tw-mono-700
        text-tw-mono-900 dark:text-tw-mono-50
        rounded-full
        shadow-sm
        transition-colors duration-150"
                      >
                        <StarOutlined className="text-xs" />
                        Автор
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-tw-light-text-primary dark:text-tw-dark-text-primary break-words whitespace-pre-wrap leading-relaxed">
                    {parentMessage.content}
                  </div>
                  <div className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
                    <ClockCircleOutlined className="text-xs mr-1" />
                    {formatDate(parentMessage.created_at)}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-tw-light-error dark:text-tw-dark-error">
                  Сообщение не найдено
                </div>
              )}
            </div>
          </AppContainer>
        </div>
      )}
    </>
  );
};
