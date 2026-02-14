import type { Attachment } from "@types";

export type AttachmentListProps = {
  attachments: Attachment[];
  onPreviewClick?: (file: Attachment) => void;
  maxVisible?: number;
  compact?: boolean;
};

export type ImageModalProps = {
  file: Attachment | null;
  onClose: () => void;
};
