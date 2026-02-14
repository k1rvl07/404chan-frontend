"use client";

import { useServiceMutation } from "@hooks";
import { uploadService } from "@services";
import type { FileUploaderProps, UploadedFile } from "@types";
import { FileText, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

export const FileUploader = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  accept = "image/*,video/*,audio/*,.pdf",
  disabled = false,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useServiceMutation<"upload", "uploadFiles", { files: File[] }, UploadedFile[]>(
    "upload",
    "uploadFiles",
    {
      onSuccess: (uploadedFiles) => {
        onFilesChange([...files, ...uploadedFiles]);
      },
      onError: () => {
        setError("Не удалось загрузить файлы");
        setTimeout(() => setError(null), 5000);
      },
    },
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFiles = useCallback(
    (fileList: FileList): File[] => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of Array.from(fileList)) {
        if (file.size > maxSizeBytes) {
          errors.push(`${file.name} превышает ${maxSizeMB}MB`);
          continue;
        }
        validFiles.push(file);
      }

      if (errors.length > 0) {
        setError(errors.join(", "));
        setTimeout(() => setError(null), 5000);
      }

      return validFiles;
    },
    [maxSizeMB],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || uploadMutation.isPending) return;

      const validFiles = validateFiles(e.dataTransfer.files);

      if (validFiles.length === 0) return;

      if (files.length + validFiles.length > maxFiles) {
        setError(`Максимум ${maxFiles} файлов`);
        setTimeout(() => setError(null), 5000);
        return;
      }

      uploadMutation.mutate({ files: validFiles });
    },
    [disabled, files.length, maxFiles, uploadMutation, validateFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || uploadMutation.isPending) return;

      const validFiles = validateFiles(e.target.files ?? new FileList());

      if (validFiles.length === 0) return;

      if (files.length + validFiles.length > maxFiles) {
        setError(`Максимум ${maxFiles} файлов`);
        setTimeout(() => setError(null), 5000);
        return;
      }

      uploadMutation.mutate({ files: validFiles });
      e.target.value = "";
    },
    [disabled, files.length, maxFiles, uploadMutation, validateFiles],
  );

  const handleRemoveFile = useCallback(
    async (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        try {
          await uploadService.deleteTemporary({ file_id: fileId });
        } catch (err) {
          console.error("Failed to cleanup temporary file:", fileId, err);
        }
      }
      onFilesChange(files.filter((f) => f.id !== fileId));
    },
    [files, onFilesChange],
  );

  const handleDropZoneClick = useCallback(() => {
    document.getElementById("file-input")?.click();
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const isImage = (contentType: string): boolean => {
    return contentType?.startsWith("image/") ?? false;
  };

  const isVideo = (contentType: string): boolean => {
    return contentType?.startsWith("video/") ?? false;
  };

  const getFileExtension = (filename: string): string => {
    const parts = filename.split(".");
    if (parts.length > 1) {
      return parts[parts.length - 1].toUpperCase();
    }
    return "FILE";
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

  const isLoading = uploadMutation.isPending;

  return (
    <div className="file-uploader w-full">
      {error && (
        <div className="error-message bg-tw-light-error/20 text-tw-light-error p-2 rounded mb-2 text-sm">{error}</div>
      )}

      <button
        type="button"
        className={`drop-zone w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-tw-light-text-link bg-tw-light-background-default"
            : "border-tw-mono-400 hover:border-tw-mono-500"
        } ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
        disabled={disabled || isLoading}
        aria-label="Загрузка файлов"
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled || isLoading}
        />
        {isLoading ? (
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-tw-mono-200 border-t-tw-mono-500 rounded-full" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-tw-light-text-secondary dark:text-tw-dark-text-secondary mb-2" />
        )}
        <p className="text-sm text-tw-light-text-secondary dark:text-tw-dark-text-secondary">
          {isLoading ? "Загрузка..." : "Перетащите файлы сюда или нажмите для выбора"}
        </p>
        <p className="text-xs text-tw-light-text-secondary dark:text-tw-dark-text-secondary mt-1 opacity-70">
          Максимум {maxFiles} файлов, каждый до {maxSizeMB}MB
        </p>
      </button>

      {files.length > 0 && (
        <div className="file-list mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((file) => {
              const hasValidUrl = file.url && file.url.length > 0;
              const isImg = isImage(file.content_type);
              const isVid = isVideo(file.content_type);

              return (
                <div
                  key={file.id}
                  className={`file-item relative group aspect-square rounded-lg overflow-hidden border-2 ${
                    isImg
                      ? "border-tw-mono-white"
                      : isVid
                        ? "border-dashed border-tw-mono-white"
                        : "border-tw-mono-white"
                  }`}
                >
                  {isImg && hasValidUrl ? (
                    <img src={file.url} alt={file.name} className="object-cover w-full h-full" />
                  ) : isVid && hasValidUrl ? (
                    <video src={file.url} className="object-cover w-full h-full" muted preload="metadata" />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-tw-mono-100 dark:bg-tw-mono-800">
                      <FileText className="w-8 h-8 text-tw-mono-500" />
                      <span className="mt-1 text-xs text-tw-light-text-secondary dark:text-tw-mono-400 truncate max-w-full px-2">
                        {getFileExtension(file.name)}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="absolute top-1 right-1 p-1 bg-tw-mono-black/50 rounded-full"
                    disabled={disabled || isLoading}
                  >
                    <X className="w-4 h-4 text-tw-mono-white" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-tw-mono-black to-transparent p-2">
                    <p className="text-xs text-tw-mono-white truncate" title={file.name}>
                      {truncateFileName(file.name, isImg || isVid ? 32 : 16)}
                    </p>
                    <p className="text-xs text-tw-mono-300">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
