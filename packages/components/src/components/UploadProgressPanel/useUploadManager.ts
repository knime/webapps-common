import { computed, ref } from "vue";

import { type UploadManagerNS, uploadManager } from "@knime/utils";

import type { UploadItem } from "./types";

type UseUploadManagerOptions = Omit<
  UploadManagerNS.UploaderConfig,
  "onProgress"
> & {
  prepareUpload: (
    parentId: string,
    files: Array<File>,
  ) => Promise<Array<{ uploadId: string; file: File }>>;
};

export const useUploadManager = (options: UseUploadManagerOptions) => {
  const uploadState = ref<Record<string, UploadItem>>({});

  const { uploadFiles, cancel } = uploadManager.createUploadManager({
    ...options,

    onFileUploadComplete: (params) => {
      uploadState.value[params.uploadId].status = "complete";
      options.onFileUploadComplete?.(params);
    },

    onFileUploadFailed: (uploadId) => {
      uploadState.value[uploadId].status = "failed";
    },

    onProgress: (uploadId, progress) => {
      uploadState.value[uploadId].progress = progress;
    },
  });

  const start = async (parentId: string, files: FileList) => {
    const uploadPayload = await options.prepareUpload(parentId, [...files]);

    uploadPayload.forEach(({ uploadId, file }) => {
      uploadState.value[uploadId] = {
        id: uploadId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "inprogress",
      };
    });

    await uploadFiles(uploadPayload);
  };

  const canCancel = (uploadId: string) =>
    uploadState.value[uploadId]?.status === "inprogress" ||
    uploadState.value[uploadId]?.status === "failed";

  const removeItem = (uploadId: string) => {
    if (canCancel(uploadId)) {
      cancel(uploadId);
    }

    delete uploadState.value[uploadId];
  };

  const resetState = () => {
    uploadState.value = {};
  };

  return {
    uploadItems: computed(() => Object.values(uploadState.value)),
    start,
    cancel: (uploadId: string) => {
      cancel(uploadId);
      uploadState.value[uploadId].status = "cancelled";
    },
    canCancel,
    removeItem,
    resetState,
  };
};
