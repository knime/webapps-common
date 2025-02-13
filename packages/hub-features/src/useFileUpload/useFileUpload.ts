import { computed, reactive, readonly, ref } from "vue";
import { FetchError, type FetchOptions } from "ofetch";

import { useUploadManager } from "@knime/components";
import { getFileMimeType, knimeFileFormats, promise } from "@knime/utils";

import { getFetchClient } from "../common/ofetchClient";
import { rfcErrors } from "../rfcErrors";

const DEFAULT_MAX_UPLOAD_QUEUE_SIZE = 10;

const DEFAULT_API_BASE_URL = "/_/api";

const DEFAULT_RETRY_DELAY_MS = 50;

type UseFileUploadOptions = {
  /**
   * Max number of concurrent uploads allowed in the upload queue.
   * When an upload is started with a number of files that exceed the pending
   * uploads then only files up-to the max queue size will be processed and the rest
   * will be ignored. This will also call the `onUploadQueueSizeExceeded` callback
   */
  maxUploadQueueSize?: number;
  onFileUploadComplete?: (payload: {
    uploadId: string;
    filePartIds: Record<number, string>;
    parentId: string;
  }) => void;
  onFileUploadFailed?: (payload: {
    uploadId: string;
    error: Error;
    parentId: string;
  }) => void;
  onUploadQueueSizeExceeded?: (maxQueueSize: number) => void;
  /**
   * Options to customize the fetch client used internally to make http requests.
   * e.g: headers, baseUrl, etc
   */
  customFetchClientOptions?: FetchOptions;
};

/**
 * This composable handles uploads of data to a hub repository item (space or workflow group).
 * It is a multi-step process which is described as follows:
 *
 * Step 1:
 * First we need to prepare an upload. The items will will be uploaded to a `parent` container
 * identified by its id. Then, for each file we want to upload, we must provide paths relative
 * to the parent that identify each file. Example:
 *  ```
 *   {
 *      "items": {
 *          "my-file.txt": { itemContentType: "text/plain", itemContentSize: 5000 },
 *          "folder/my-file.zip": { itemContentType: "application/zip", itemContentSize: 5000 },
 *      }
 *   }
 *  ```
 * This describes 2 items, one placed in the parent's root and another inside a folder.
 * The response for this would look like:
 *  ```
 *   {
 *      "items": {
 *          "my-file.txt": { uploadId: "id1" },
 *          "folder/my-file.zip": { uploadId: "id2" },
 *      }
 *   }
 *  ```
 * Now, each corresponding `uploadId` uniquely identifies the upload process for
 * their respective files.
 *
 * Step 2:
 * Next, we need to start uploading the file parts. Technically, you _can_ just upload
 * each file as one big file "part", but practicaly that is not recommended because a hiccup
 * in the connection means you would have to start the upload from scratch; instead, we split
 * the files in smaller parts.
 * The upload manager helper will take care of splitting the file. However, the responsibility
 * of this composable is to supply a function to resolve the upload URL. This upload URL is obtained
 * by POSTing to an endpoint with the `uploadId` and the `partNumber` and this will return
 * the data required to make an upload to a presigned URL; this will be called for each file part.
 *
 * Step 3:
 * Completion:
 * Once the upload of a single file is complete, the upload manager will trigger the `onFileUploadComplete`
 * callback, which then will supply the ids of all the different parts that got uploaded for a given `uploadId`
 * Then we need to "complete" the upload by sending a request which provides the `uploadId` and a list of
 * the ids of all the parts
 *
 * Cancellation:
 * Alternative to completion, you can also cancel an upload. For this, the composable makes a DELETE request
 * providing the corresponding `uploadId` which will effectively cancel it.
 *
 *
 * Usage example:
 * ```
 * const { start, uploadItems, cancel } = useFileUpload();
 *
 * const someEventHandler = (parentId: string, files: File[]) => {
 *    start(parentId, files);
 * }
 *
 * <template>
 *    <!-- `uploadItems` will reactively update -->
 *    <div v-for="item in uploadItems" :key="item.id">
 *      <span>{{ item.name }} / {{ item.size }}</span>
 *      <hr />
 *      <span>Progress: {{ item.progress }}</span>
 *    </div>
 * </template>
 * ```
 */
export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const baseUrl =
    options.customFetchClientOptions?.baseURL ?? DEFAULT_API_BASE_URL;
  const $ofetch = getFetchClient(options.customFetchClientOptions);

  const prepareUpload = (
    parentId: string,
    files: Array<File>,
  ): Promise<Array<{ uploadId: string; file: File }>> => {
    const fileDictionary = Object.fromEntries(
      files.map((file) => {
        // strip extension for workflows
        const name = knimeFileFormats.KNWF.getNameOrDefault(file, file.name);

        return [name, file];
      }),
    );

    // map file dictionary to body payload of the prepare upload request
    const items: Record<string, { itemContentType: string }> =
      Object.fromEntries(
        Object.entries(fileDictionary).map(([name, file]) => [
          name,
          {
            itemContentType: getFileMimeType(file),
            itemContentSize: file.size,
          },
        ]),
      );

    type PrepareUploadResponse = {
      items: Record<string, { uploadId: string }>;
    };

    return $ofetch<PrepareUploadResponse>(
      `${baseUrl}/repository/${parentId}/manifest`,
      { method: "POST", body: { items } },
    ).then(({ items }) => {
      return Object.keys(items).map((name) => {
        const { uploadId } = items[name];
        const file = fileDictionary[name];
        return { uploadId, file };
      });
    });
  };

  const resolveFilePartUploadURL = (uploadId: string, partNumber: number) => {
    type UploadURLResponse = {
      method: string;
      url: string;
      header: { Host: string };
    };

    return $ofetch<UploadURLResponse>(
      `${baseUrl}/uploads/${uploadId}/parts/?partNumber=${partNumber}`,
      { method: "POST" },
    );
  };

  const completeUpload = (
    uploadId: string,
    partIds: Record<number, string>,
  ) => {
    return $ofetch(`${baseUrl}/uploads/${uploadId}`, {
      method: "POST",
      body: partIds,
    });
  };

  const cancelUpload = (uploadId: string) => {
    return $ofetch(`${baseUrl}/uploads/${uploadId}`, {
      method: "DELETE",
    });
  };

  // contains upload ids for files that have a processing step which was not finished yet
  const unprocessedUploads = reactive<Set<string>>(new Set());
  const isFileWithProcessing = (file: File) =>
    knimeFileFormats.KNWF.matches(file);

  let useUploadManagerResult: ReturnType<typeof useUploadManager> | null = null;

  const setProcessingCompleted = ({ uploadId }: { uploadId: string }) => {
    unprocessedUploads.delete(uploadId);
  };

  const setProcessingFailed = ({
    uploadId,
    error,
  }: {
    uploadId: string;
    error?: Error;
  }) => {
    unprocessedUploads.delete(uploadId);
    useUploadManagerResult?.setFailed(
      uploadId,
      error ?? new Error("An error occurred when processing the file"),
    );
  };

  useUploadManagerResult = useUploadManager({
    resolveFilePartUploadURL,

    onFileUploadComplete: ({ uploadId, filePartIds, parentId }) => {
      promise
        .retryPromise({ fn: () => completeUpload(uploadId, filePartIds) })
        .then(() => {
          options.onFileUploadComplete?.({ uploadId, filePartIds, parentId });
        })
        .catch((error) => {
          consola.error("Error attempting to complete upload", { error });
          setProcessingFailed({ uploadId, error });
        });
    },

    onFileUploadFailed: ({ uploadId, error, parentId }) => {
      options?.onFileUploadFailed?.({ uploadId, error, parentId });
    },
  });

  const getEnqueueableFiles = (files: File[]): File[] => {
    const { totalPendingUploads } = useUploadManagerResult;

    const { maxUploadQueueSize = DEFAULT_MAX_UPLOAD_QUEUE_SIZE } = options;

    if (files.length + totalPendingUploads.value > maxUploadQueueSize) {
      options.onUploadQueueSizeExceeded?.(maxUploadQueueSize);
    }

    // only keep as many files as the queue allows
    return files.slice(0, maxUploadQueueSize - totalPendingUploads.value);
  };

  const { uploadState, ...uploadMangerResultRest } = useUploadManagerResult;

  const uploadItems = computed(() => {
    return Object.values(uploadState.value).map((uploadItem) => ({
      ...uploadItem,
      status:
        uploadItem.status === "complete" &&
        unprocessedUploads.has(uploadItem.id)
          ? "processing"
          : uploadItem.status,
    }));
  });

  const prepareQueueSize = ref(0);

  return {
    ...uploadMangerResultRest,
    uploadItems,
    unprocessedUploads: readonly(unprocessedUploads),
    setProcessingCompleted,
    setProcessingFailed,

    isPreparingUpload: computed(() => prepareQueueSize.value > 0),
    totalFilesBeingPrepared: computed(() => prepareQueueSize.value),

    start: async (parentId: string, files: File[]) => {
      const enqueableFiles = getEnqueueableFiles(files);
      try {
        if (enqueableFiles.length === 0) {
          return;
        }

        prepareQueueSize.value += enqueableFiles.length;

        const uploadPayload = await promise.retryPromise({
          fn: () => prepareUpload(parentId, enqueableFiles),
          excludeError: (error: FetchError) =>
            // eslint-disable-next-line no-magic-numbers
            Boolean(error.statusCode && error.statusCode < 500),
          retryDelayMS: DEFAULT_RETRY_DELAY_MS,
        });

        uploadPayload.forEach(({ uploadId, file }) => {
          if (isFileWithProcessing(file)) {
            unprocessedUploads.add(uploadId);
          }
        });

        useUploadManagerResult.start(parentId, uploadPayload);
      } catch (error) {
        if (error instanceof FetchError) {
          throw rfcErrors.tryParse(error);
        }

        throw error;
      } finally {
        // errors can only be thrown in the prepareUpload call, useUploadManagerResult.start does its own error handling
        prepareQueueSize.value -= enqueableFiles.length;
      }
    },

    cancel: (uploadId: string) => {
      useUploadManagerResult.cancel(uploadId);
      cancelUpload(uploadId).catch((error) => {
        consola.error("There was a problem cancelling the upload", { error });
      });
    },
  };
};
