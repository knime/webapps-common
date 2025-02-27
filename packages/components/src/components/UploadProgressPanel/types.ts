import type { UploadStateName } from "@knime/utils";

export type UploadItemStatus = Exclude<UploadStateName, "idle"> | "processing";

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  progress?: number;
  status?: UploadItemStatus;
  failureDetails?: string;
};
