import { computed, ref } from "vue";

import { type UploadManagerNS, promise, uploadManager } from "@knime/utils";

import type { UploadItem } from "./types";

type UseUploadManagerOptions = Omit<
  UploadManagerNS.UploaderConfig,
  "onProgress"
> & {
  /**
   * Function necessary to prepare the upload of multiple files.
   * This will be called before starting the upload process and the resolved
   * value from the promise will be forwarded to the `uploadManager` util
   */
  prepareUpload: (
    parentId: string,
    files: Array<File>,
  ) => Promise<Array<{ uploadId: string; file: File }>>;
};

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
      options.onFileUploadFailed?.(uploadId, error);
    },

    onProgress: (uploadId, progress) => {
      uploadState.value[uploadId].progress = progress;
    },
  });

  const start = async (parentId: string, files: File[]) => {
    // TODO: HUB-9102: improve error handling here. see ticket for details
    try {
      const uploadPayload = await promise.retryPromise(() =>
        options.prepareUpload(parentId, files),
      );
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
      consola.error("Could not prepare upload", error);

      files.forEach((file) => {
        const randomId = window.crypto.randomUUID();
        uploadState.value[randomId] = {
          id: randomId,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "failed",
          parentId,
        };
      });
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
    setFailed: (uploadId: string, error: Error) => {
      uploadState.value[uploadId].status = "failed";
      setFailed(uploadId, error);
    },
  };
};
