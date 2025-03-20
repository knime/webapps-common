import type { DownloadItem } from "packages/components/src/components/DownloadProgressPanel/types";

export const downloadItemMocks: DownloadItem[] = [
  {
    name: "Important workflows (v1)",
    downloadId: "some-id",
    status: "READY",
  },
  {
    name: "My folder",
    downloadId: "some-id",
    status: "IN_PROGRESS",
  },
  {
    name: "Cool stuff",
    downloadId: "some-id",
    status: "CANCELLED",
    failureDetails: "Download was cancelled by user",
  },
  {
    name: "Other stuff",
    downloadId: "some-id",
    status: "FAILED",
    failureDetails: "We found a bug in the computer room",
  },
];
