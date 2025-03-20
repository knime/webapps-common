export type DownloadItem = {
  downloadId: string;
  name: string;
  status: "IN_PROGRESS" | "CANCELLED" | "READY" | "FAILED";
  downloadUrl?: string;
  failureDetails?: string;
};
