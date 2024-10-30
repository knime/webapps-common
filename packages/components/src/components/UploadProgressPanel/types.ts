import type { UploadManagerNS } from "@knime/utils";

export type UploadItemStatus = Exclude<UploadManagerNS.UploadStateName, "idle">;

export type UploadItem = {
  id: string;
  name: string;
  progress: number;
  size: number;
  status: UploadItemStatus;
};
