"use client";

import { ImageModal } from "@components";
import type { Attachment } from "@types";
import { useState } from "react";
import type { AttachmentListProps } from "./types";

const isImage = (contentType?: string): boolean => {
  return contentType?.startsWith("image/") ?? false;
};

const isVideo = (contentType?: string): boolean => {
  return contentType?.startsWith("video/") ?? false;
};

const isAudio = (contentType?: string): boolean => {
  return contentType?.startsWith("audio/") ?? false;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes < 1024) return "0 B";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const hasValidUrl = (url?: string): boolean => {
  return typeof url === "string" && url.length > 0 && url.trim().length > 0;
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

type MediaAttachment = Attachment & { mediaType: "image" | "video" };

const getMediaType = (file: Attachment): "image" | "video" | null => {
  if (isImage(file.content_type)) return "image";
  if (isVideo(file.content_type)) return "video";
  return null;
};

const getBorderClass = (mediaType: "image" | "video" | null): string => {
  if (mediaType === "image") {
    return "border-2 border-tw-mono-black dark:border-tw-mono-white";
  }
  if (mediaType === "video") {
    return "border-2 border-dashed border-tw-mono-black dark:border-tw-mono-white";
  }
  return "";
};

const MediaThumbnail = ({
  file,
  onClick,
  compact = false,
}: {
  file: MediaAttachment;
  onClick?: () => void;
  compact?: boolean;
}) => {
  const mediaType = getMediaType(file);

  return (
    // biome-ignore lint/a11y/useSemanticElements: Cannot use <button> inside ThreadCard which already uses button
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`no-navigate relative rounded-lg overflow-hidden cursor-pointer transition-all duration-150 ${getBorderClass(mediaType)} hover:border-tw-mono-500 focus:outline-none focus:ring-2 focus:ring-tw-mono-500 ${
        compact ? "w-32 h-24" : "w-40 h-32 lg:w-48 lg:h-36"
      }`}
    >
      {mediaType === "image" ? (
        <img src={file.file_url} alt={truncateFileName(file.file_name, 32)} className="object-cover w-full h-full" />
      ) : (
        <video src={file.file_url} className="object-cover w-full h-full" muted preload="metadata" />
      )}
    </div>
  );
};

const AudioAttachment = ({ file }: { file: Attachment }) => {
  return (
    <div className="no-navigate grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-x-3 gap-y-3 bg-tw-mono-100 dark:bg-tw-mono-900 rounded h-[90px] px-3 py-2">
      <span
        className="text-xs text-tw-light-text-primary dark:text-tw-dark-text-primary truncate row-start-1 col-start-1"
        title={file.file_name}
      >
        {truncateFileName(file.file_name, 32)}
      </span>
      <span className="text-xs text-tw-mono-500 row-start-1 col-start-2 self-start">
        {formatFileSize(file.file_size)}
      </span>
      <audio src={file.file_url} controls className="row-start-2 col-span-2 h-full w-full bg-transparent">
        <track kind="captions" label="Без субтитров" />
      </audio>
    </div>
  );
};

const OtherFileLink = ({ file }: { file: Attachment }) => {
  return (
    <span className="no-navigate whitespace-nowrap inline">
      <a
        href={file.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-tw-light-text-link dark:text-tw-dark-text-link hover:underline truncate max-w-[200px] inline"
        title={file.file_name}
      >
        {truncateFileName(file.file_name, 16)}
      </a>
    </span>
  );
};

const CompactView = ({ attachments, onPreviewClick, maxVisible }: AttachmentListProps) => {
  const mediaAttachments = attachments.filter(
    (file): file is MediaAttachment => getMediaType(file) !== null && hasValidUrl(file.file_url),
  );
  const audioFiles = attachments.filter((file) => isAudio(file.content_type) && hasValidUrl(file.file_url));
  const otherFiles = attachments.filter((file) => !(getMediaType(file) || isAudio(file.content_type)));

  const visibleMedia = maxVisible ? mediaAttachments.slice(0, maxVisible) : mediaAttachments;
  const remainingCount = Math.max(0, mediaAttachments.length - (maxVisible ?? 0));

  return (
    <div className="mt-3 space-y-2">
      {visibleMedia.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visibleMedia.map((file) => (
            <MediaThumbnail key={file.id} file={file} onClick={() => onPreviewClick?.(file)} compact />
          ))}
          {remainingCount > 0 && (
            <div className="w-32 h-24 rounded overflow-hidden bg-tw-mono-900/80 flex items-center justify-center">
              <span className="text-tw-mono-white text-sm font-medium">+{remainingCount}</span>
            </div>
          )}
        </div>
      )}

      {audioFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {audioFiles.map((file) => (
            <AudioAttachment key={file.id} file={file} />
          ))}
        </div>
      )}

      {otherFiles.length > 0 && (
        <div className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary flex flex-wrap">
          {otherFiles.map((file, idx) => (
            <span key={file.id} className="whitespace-nowrap inline mr-1">
              <OtherFileLink key={file.id} file={file} />
              {idx < otherFiles.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FullView = ({ attachments, onPreviewClick }: AttachmentListProps) => {
  const mediaAttachments = attachments.filter(
    (file): file is MediaAttachment => getMediaType(file) !== null && hasValidUrl(file.file_url),
  );
  const audioFiles = attachments.filter((file) => isAudio(file.content_type) && hasValidUrl(file.file_url));
  const otherFiles = attachments.filter((file) => !(getMediaType(file) || isAudio(file.content_type)));

  return (
    <div className="mt-3 space-y-3">
      {mediaAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mediaAttachments.map((file) => (
            <MediaThumbnail key={file.id} file={file} onClick={() => onPreviewClick?.(file)} />
          ))}
        </div>
      )}

      {audioFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {audioFiles.map((file) => (
            <AudioAttachment key={file.id} file={file} />
          ))}
        </div>
      )}

      {otherFiles.length > 0 && (
        <div className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary flex flex-wrap">
          {otherFiles.map((file, idx) => (
            <span key={file.id} className="whitespace-nowrap inline mr-1">
              <OtherFileLink key={file.id} file={file} />
              {idx < otherFiles.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const AttachmentList = (props: AttachmentListProps) => {
  if (!props.attachments || props.attachments.length === 0) {
    return null;
  }

  const [previewFile, setPreviewFile] = useState<Attachment | null>(null);

  const handlePreviewClick = (file: Attachment) => {
    setPreviewFile(file);
  };

  if (props.compact) {
    return (
      <>
        <CompactView {...props} onPreviewClick={handlePreviewClick} />
        {previewFile && <ImageModal file={previewFile} onClose={() => setPreviewFile(null)} />}
      </>
    );
  }

  return (
    <>
      <FullView {...props} onPreviewClick={handlePreviewClick} />
      {previewFile && <ImageModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </>
  );
};
