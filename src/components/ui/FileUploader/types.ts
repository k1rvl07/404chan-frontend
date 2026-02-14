import type { UploadedFile } from "@types";

export type FileUploaderProps = {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  disabled?: boolean;
};
