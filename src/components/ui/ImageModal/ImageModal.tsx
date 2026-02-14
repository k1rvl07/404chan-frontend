"use client";

import type { Attachment, ImageModalProps } from "@types";
import { File } from "lucide-react";
import { useEffect } from "react";

const isImage = (contentType?: string): boolean => {
  return contentType?.startsWith("image/") ?? false;
};

const isVideo = (contentType?: string): boolean => {
  return contentType?.startsWith("video/") ?? false;
};

const isAudio = (contentType?: string): boolean => {
  return contentType?.startsWith("audio/") ?? false;
};

const hasValidUrl = (url?: string): boolean => {
  return typeof url === "string" && url.length > 0 && url.trim().length > 0;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes < 1024) return "0 B";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const truncateFileName = (name: string, maxLength: number): string => {
  const extIndex = name.lastIndexOf(".");
  if (extIndex === -1) {
    if (name.length <= maxLength) return name;
    return `${name.slice(0, maxLength - 3)}...`;
  }
  const ext = name.slice(extIndex);
  const nameWithoutExt = name.slice(0, extIndex);
  const totalLength = nameWithoutExt.length + ext.length;
  if (totalLength <= maxLength) return name;
  const truncatedName = nameWithoutExt.slice(0, maxLength - ext.length - 3);
  return `${truncatedName}...${ext}`;
};

export const ImageModal = ({ file, onClose }: ImageModalProps) => {
  if (!file) return null;

  const isImg = isImage(file.content_type);
  const isVid = isVideo(file.content_type);
  const isAud = isAudio(file.content_type);
  const urlValid = hasValidUrl(file.file_url);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
      // biome-ignore lint/a11y/useSemanticElements: Using div with role instead of <dialog> for better overlay styling compatibility
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-tw-mono-black/90 rounded-lg p-3 lg:p-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {isImg && urlValid ? (
          <img
            src={file.file_url}
            alt={file.file_name}
            title={file.file_name}
            className="max-w-[85vw] max-h-[60vh] lg:max-w-[90vw] lg:max-h-[75vh] object-contain rounded shadow-2xl"
          />
        ) : isVid && urlValid ? (
          <video
            src={file.file_url}
            controls
            className="max-w-[85vw] max-h-[60vh] lg:max-w-[90vw] lg:max-h-[75vh] rounded shadow-2xl"
          >
            <track kind="captions" label="Без субтитров" default />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        ) : isAud && urlValid ? (
          <div className="flex flex-col items-center text-tw-mono-white">
            <audio src={file.file_url} controls className="w-full max-w-[300px]">
              <track kind="captions" label="Без субтитров" default />
              Ваш браузер не поддерживает воспроизведение аудио.
            </audio>
          </div>
        ) : (
          <a
            href={file.file_url}
            download={file.file_name}
            className="flex flex-col items-center text-tw-mono-white hover:text-tw-mono-300"
          >
            <File className="text-4xl" />
            <span className="text-base lg:text-lg truncate max-w-[80px] lg:max-w-[300px]">
              {truncateFileName(file.file_name, 64)}
            </span>
            <span className="text-xs lg:text-sm text-tw-mono-400 mt-2">{formatFileSize(file.file_size)}</span>
          </a>
        )}
        <p className="text-tw-mono-white mt-4 text-center max-w-[80vw] lg:max-w-[90vw] truncate px-4">
          {truncateFileName(file.file_name, 64)}
        </p>
      </div>
    </div>
  );
};
