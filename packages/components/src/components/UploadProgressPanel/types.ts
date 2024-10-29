export type UploadProgressItemStatus =
  | "inprogress"
  | "complete"
  | "failed"
  | "cancelled";

export type UploadProgressItem = {
  id: string;
  name: string;
  size: number;
  status: UploadProgressItemStatus;
  progress?: number;
};
