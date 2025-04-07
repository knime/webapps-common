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

        // remove possible doublequotes (") around the etag and/or weak identifier (if either is present)
        // https://datatracker.ietf.org/doc/html/rfc7232#section-2.3
        resolve({ partId: etag.replace(/^(?:W\/)?"|"$/g, "") });
      } else {
        consola.error("Failed or unexpected XHR response", {
          xhrStatus: xhr.status,
          xhrResponse: xhr.response,
          chunkIndex,
        });
        reject(new Error("Failed to upload file"));
      }
    };

    xhr.onerror = (event) => {
      consola.error("Failed to upload chunk", {
        xhrErrorEvent: event,
        chunkIndex,
      });
      reject(new Error("Failed to upload file"));
    };

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
     * Identifier of the upload for this file (must be unique)
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
   * @param error the error that cause the failure if it exists
   * @returns
   */
  onFileUploadFailed?: (payload: { uploadId: string; error: Error }) => void;

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

/**
 * Creates and returns an `uploadManager`, a comprehensive multi-file, multi-part upload handler.
 *
 * The `uploadManager` offers functionality for handling file uploads in parts and provides
 * several built-in mechanisms to ensure the process is reliable and adaptable.
 *
 * Key features include:
 *
 * - **Chunked File Uploads**: Splits provided files into manageable chunks and initiates the upload
 *   for each part using the `resolveFilePartUploadURL` function provided in the configuration.
 *
 * - **Retry Mechanism**: Automatically retries failed upload attempts up to a maximum of 5 times
 *   per failed request.
 *
 * - **Upload Cancellation**: Allows cancellation of ongoing uploads, giving users control over the process.
 *
 * - **Progress Tracking**: Monitors the progress of each file part upload and triggers the `onProgress`
 *   callback to provide updates.
 *
 * - **Error Handling**: The returned `uploadFiles` function does not throw errors directly. Instead,
 *   it manages retries and stops any failed uploads after the retry limit is reached, marking them as failed.
 *   This ensures that the promise it returns completes gracefully without uncaught exceptions.
 *
 */
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

  const setFailed = (uploadId: string, error: Error) => {
    if (!uploadStateMap.has(uploadId)) {
      consola.error("failed:: Invalid upload id");
      return;
    }

    setUploadState(uploadId, { state: "failed" });
    onFileUploadFailed?.({ uploadId, error });
    failedUploads.add(uploadId);

    if (completedUploads.has(uploadId)) {
      completedUploads.delete(uploadId);
    }
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
        const { method, url } = await retryPromise({
          fn: () => getUploadFilePartUrl(uploadId, chunkIndex + 1),
          retryCount: DEFAULT_RETRY_COUNT,
          retryDelayMS: DEFAULT_RETRY_DELAY_MS,
        });

        consola.trace("File part upload url resolved", { method, url });

        const onChunkUploadProgress = (uploadedChunkBytes: number) => {
          uploadedBytes = uploadedChunkBytes + start;
          setUploadState(uploadId, { uploadedByteCount: uploadedBytes });

          const progress = Math.round((uploadedBytes / totalBytes) * 100);

          config.onProgress?.(uploadId, progress);
        };

        const filePartResponse = await runAbortablePromise(() =>
          retryPromise({
            fn: () =>
              uploadChunkWithProgress({
                method,
                url,
                chunk,
                chunkIndex,
                onProgress: onChunkUploadProgress,
                abortSignal: abortController.signal,
              }),
            retryCount: DEFAULT_RETRY_COUNT,
            retryDelayMS: DEFAULT_RETRY_DELAY_MS,
          }),
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

        setFailed(
          uploadId,
          error instanceof Error ? error : new Error(error as any),
        );
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

    return Promise.allSettled(result).then(() => {
      // state cleanup
      const completed = [...completedUploads.values()];
      const cancelled = [...cancelledUploads.values()];
      const failed = [...failedUploads.values()];

      [...completed, ...cancelled, ...failed].forEach((uploadId) =>
        uploadStateMap.delete(uploadId),
      );

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
    uploadFiles,

    getUploadState,
    isFailed,
    isCancelled,
    cancel,
    setFailed,
  };
};
