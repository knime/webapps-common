import { computed, ref } from "vue";

import { type UploadManagerNS, uploadManager } from "@knime/utils";

import type { UploadItem } from "./types";

type UseUploadManagerOptions = Omit<
  UploadManagerNS.UploaderConfig,
  "onProgress"
>;

/**
 * This composable wraps the `uploadManager` utility from
 * `@knime/utils` in order to provide reactive state that works seamlessly
 * in a Vue component
 *
 * The reactive state returned (`uploadItems`) will update whenever the progress
 * or status of each item being uploaded changes
 */
export const useUploadManager = (options: UseUploadManagerOptions) => {
  const uploadState = ref<Record<string, UploadItem & { parentId: string }>>(
    {},
  );

  const { uploadFiles, cancel, setFailed } = uploadManager.createUploadManager({
    ...options,

    onFileUploadComplete: (params) => {
      uploadState.value[params.uploadId].status = "complete";
      options.onFileUploadComplete?.(params);
    },

    onFileUploadFailed: (uploadId, error) => {
      uploadState.value[uploadId].status = "failed";
      uploadState.value[uploadId].failureDetails = error.message;
      options.onFileUploadFailed?.(uploadId, error);
    },

    onProgress: (uploadId, progress) => {
      uploadState.value[uploadId].progress = progress;
    },
  });

  const start = async (
    parentId: string,
    uploadPayload: Array<{ uploadId: string; file: File }>,
  ) => {
    try {
      uploadPayload.forEach(({ uploadId, file }) => {
        uploadState.value[uploadId] = {
          id: uploadId,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "inprogress",
          parentId,
        };
      });

      await uploadFiles(uploadPayload);
    } catch (error) {
      consola.error("Error uploading files", error);
    }
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

  const uploadItems = computed(() => Object.values(uploadState.value));

  const hasPendingUploads = computed(() =>
    uploadItems.value.some(({ status }) => status === "inprogress"),
  );

  const totalPendingUploads = computed(
    () =>
      uploadItems.value.filter(({ status }) => status === "inprogress").length,
  );

  return {
    uploadState,
    hasPendingUploads,
    totalPendingUploads,
    start,
    cancel: (uploadId: string) => {
      cancel(uploadId);
      uploadState.value[uploadId].status = "cancelled";
    },
    canCancel,
    removeItem,
    resetState,
    setFailed: (uploadId: string, error: Error) => {
      uploadState.value[uploadId].status = "failed";
      uploadState.value[uploadId].failureDetails = error.message;
      setFailed(uploadId, error);
    },
  };
};
