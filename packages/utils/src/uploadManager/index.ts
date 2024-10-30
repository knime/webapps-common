import { AbortError, createAbortablePromise, retryPromise } from "../promise";

// eslint-disable-next-line no-magic-numbers
const CHUNK_SIZE = 50 * 1024 * 1024; // 50 MB per chunk

const DEFAULT_RETRY_COUNT = 5;
const DEFAULT_RETRY_DELAY_MS = 50;

export type UploadStateName =
  | "idle"
  | "inprogress"
  | "cancelled"
  | "failed"
  | "complete";

export type PartUploadResponse = {
  partId: string;
};

const uploadChunkWithProgress = (params: {
  method: string;
  url: string;
  chunk: Blob;
  chunkIndex: number;
  onProgress: (progress: number) => void;
  abortSignal: AbortSignal;
}) => {
  const { method, url, chunk, chunkIndex, onProgress, abortSignal } = params;

  const OK = 200;

  return new Promise<{ partId: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    abortSignal.addEventListener("abort", () => xhr.abort());

    // Track the upload progress of the current chunk
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded);
      }
    };

    xhr.onload = () => {
      if (xhr.status === OK) {
        const etag = xhr.getResponseHeader("ETag");

        if (!etag) {
          reject(new Error("Invalid part upload response"));
          return;
        }

        // slice to remove double quotes (") around the etag value
        resolve({ partId: etag.slice(1, -1) });
      } else {
        reject(new Error(`Failed to upload chunk ${chunkIndex}`));
      }
    };

    xhr.onerror = () =>
      reject(new Error(`Failed to upload chunk ${chunkIndex}`));

    xhr.send(chunk);
  });
};

export type UploaderManagerConfig = {
  /**
   * Function to resolve the metadata for a request to upload a file part
   * @param uploadId
   * @param partNumber
   * @returns
   */
  resolveFilePartUploadURL: (
    uploadId: string,
    partNumber: number,
  ) => Promise<{ method: string; url: string }>;

  /**
   * Callback that gets triggered when the whole file is uploaded.
   * @param
   * @returns
   */
  onFileUploadComplete?: (payload: {
    /**
     * Identifier of the upload for this file
     */
    uploadId: string;
    /**
     * Ids of all the uploaded file parts
     */
    filePartIds: Record<number, string>;
  }) => void;

  /**
   * Callback that gets triggered when an upload has failed.
   * @param uploadId
   * @returns
   */
  onFileUploadFailed?: (uploadId: string) => void;

  /**
   * Callback that gets triggered when the progress of a file part upload
   * for a specific upload id is updated
   * @param uploadId
   * @param progress
   * @returns
   */
  onProgress?: (uploadId: string, progress: number) => void;
};

type UploadState = {
  uploadId: string;
  file: File;
  completedChunkCount: number;
  uploadedByteCount: number;
  state: UploadStateName;
  abortController: AbortController;
};

export const createUploadManager = (config: UploaderManagerConfig) => {
  const {
    resolveFilePartUploadURL: getUploadFilePartUrl,
    onFileUploadComplete,
    onFileUploadFailed,
  } = config;
  const uploadStateMap = new Map<string, UploadState>();

  const completedUploads = new Set<string>();
  const cancelledUploads = new Set<string>();
  const failedUploads = new Set<string>();

  const assertState = (uploadId: string, state: UploadStateName) =>
    uploadStateMap.has(uploadId) &&
    uploadStateMap.get(uploadId)!.state === state;

  const getUploadState = (uploadId: string) => uploadStateMap.get(uploadId);
  const setUploadState = (uploadId: string, state: Partial<UploadState>) => {
    uploadStateMap.set(uploadId, {
      ...uploadStateMap.get(uploadId)!,
      ...state,
    });
  };

  const isFailed = (uploadId: string) => assertState(uploadId, "failed");
  const isCancelled = (uploadId: string) => assertState(uploadId, "cancelled");

  const getTotalFileParts = (file: File) => Math.ceil(file.size / CHUNK_SIZE);

  const abortInFlightUpload = (uploadId: string, reason: string) => {
    const currentState = uploadStateMap.get(uploadId);

    if (!currentState) {
      return;
    }

    currentState.abortController.abort(
      new AbortError(
        `Upload (${currentState.uploadId}) for file "${currentState.file.name}" aborted. Reason: "${reason}"`,
      ),
    );
  };

  const cancel = (uploadId: string) => {
    if (!uploadStateMap.has(uploadId)) {
      consola.error("cancel:: Invalid upload id");
      return;
    }

    setUploadState(uploadId, { state: "cancelled" });

    abortInFlightUpload(uploadId, "upload cancelled");
    cancelledUploads.add(uploadId);
  };

  const setFailed = (uploadId: string) => {
    if (!uploadStateMap.has(uploadId)) {
      consola.error("failed:: Invalid upload id");
      return;
    }

    setUploadState(uploadId, { state: "failed" });
    onFileUploadFailed?.(uploadId);
    failedUploads.add(uploadId);
  };

  const uploadFileFromChunkIndex = async (
    uploadId: string,
    file: File,
    initialChunkIndex = 0,
  ) => {
    const totalChunks = getTotalFileParts(file);
    const totalBytes = file.size;
    const completedPartIds: Record<number, string> = {};

    const { abortController, runAbortablePromise } = createAbortablePromise();

    uploadStateMap.set(uploadId, {
      uploadId,
      file,
      state: "inprogress",
      uploadedByteCount: uploadStateMap.get(uploadId)?.uploadedByteCount ?? 0,
      completedChunkCount:
        uploadStateMap.get(uploadId)?.completedChunkCount ?? 0,
      abortController,
    });

    let chunkIndex = initialChunkIndex;
    let uploadedBytes = uploadStateMap.get(uploadId)?.uploadedByteCount;

    while (chunkIndex < totalChunks) {
      if (isCancelled(uploadId) || isFailed(uploadId)) {
        break;
      }

      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);

      const chunk = file.slice(start, end);

      try {
        const { method, url } = await retryPromise(
          () => getUploadFilePartUrl(uploadId, chunkIndex + 1),
          DEFAULT_RETRY_COUNT,
          DEFAULT_RETRY_DELAY_MS,
        );

        consola.trace("File part upload url resolved", { method, url });

        const onChunkUploadProgress = (uploadedChunkBytes: number) => {
          uploadedBytes = uploadedChunkBytes + start;
          setUploadState(uploadId, { uploadedByteCount: uploadedBytes });

          const progress = Math.round((uploadedBytes / totalBytes) * 100);

          config.onProgress?.(uploadId, progress);
        };

        const filePartResponse = await runAbortablePromise(() =>
          retryPromise(
            () =>
              uploadChunkWithProgress({
                method,
                url,
                chunk,
                chunkIndex,
                onProgress: onChunkUploadProgress,
                abortSignal: abortController.signal,
              }),
            DEFAULT_RETRY_COUNT,
            DEFAULT_RETRY_DELAY_MS,
          ),
        );

        consola.trace(
          `${file.name}: Chunk ${chunkIndex + 1} of ${totalChunks} uploaded successfully`,
        );

        completedPartIds[chunkIndex + 1] = filePartResponse.partId;

        setUploadState(uploadId, {
          completedChunkCount:
            uploadStateMap.get(uploadId)!.completedChunkCount + 1,
        });
      } catch (error) {
        if (error instanceof AbortError) {
          consola.info("Aborted::", error);
          return;
        }

        setFailed(uploadId);
        return;
      }

      chunkIndex++;
    }

    if (isCancelled(uploadId) || isFailed(uploadId)) {
      return;
    }

    setUploadState(uploadId, {
      completedChunkCount: totalChunks,
      state: "complete",
    });

    completedUploads.add(uploadId);
    onFileUploadComplete?.({ uploadId, filePartIds: completedPartIds });
  };

  const uploadFiles = (files: Array<{ uploadId: string; file: File }>) => {
    const result: Array<Promise<any>> = [];

    for (const { uploadId, file } of files) {
      result.push(uploadFileFromChunkIndex(uploadId, file));
    }

    return Promise.all(result).then(() => {
      // state cleanup
      const completed = [...completedUploads.values()];
      const cancelled = [...cancelledUploads.values()];
      const failed = [...failedUploads.values()];

      ([] as string[])
        .concat([...completed, ...cancelled, ...failed])
        .forEach((uploadId) => uploadStateMap.delete(uploadId));

      completedUploads.clear();
      cancelledUploads.clear();
      failedUploads.clear();

      return {
        completed,
        cancelled,
        failed,
      };
    });
  };

  return {
    uploadFile: (uploadId: string, file: File) =>
      uploadFileFromChunkIndex(uploadId, file).then(() => {
        uploadStateMap.delete(uploadId);

        const isCompleted = completedUploads.has(uploadId);
        const isCancelled = cancelledUploads.has(uploadId);
        const isFailed = failedUploads.has(uploadId);

        completedUploads.delete(uploadId);
        cancelledUploads.delete(uploadId);
        failedUploads.delete(uploadId);

        return {
          completed: isCompleted,
          cancelled: isCancelled,
          failed: isFailed,
        };
      }),

    uploadFiles,

    getUploadState,
    isFailed,
    isCancelled,
    cancel,
  };
};
