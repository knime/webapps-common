import { computed, ref } from "vue";

import { useUploadManager } from "@knime/components";
import { getFileMimeType, promise } from "@knime/utils";

const DEFAULT_MAX_UPLOAD_QUEUE_SIZE = 10;

const DEFAULT_API_BASE_URL = "/_/api";

type UseFileUploadOptions = {
  /**
   * Max number of concurrent uploads allowed in the upload queue.
   * When an upload is started with a number of files that exceed the pending
   * uploads then only files up-to the max queue size will be processed and the rest
   * will be ignored. This will also call the `onUploadQueueSizeExceeded` callback
   */
  maxUploadQueueSize?: number;
  apiBaseUrl?: string;
  onFileUploadComplete?: (
    uploadId: string,
    filePartIds: Record<number, string>,
  ) => void;
  onFileUploadFailed?: (uploadId: string, error: Error) => void;
  onUploadQueueSizeExceeded?: (maxQueueSize: number) => void;
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
 *          "my-file.txt": { itemContentType: "text/plain" },
 *          "folder/my-file.zip": { itemContentType: "application/zip" },
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
  const baseUrl = computed(() => options.apiBaseUrl ?? DEFAULT_API_BASE_URL);

  const prepareUpload = (
    parentId: string,
    files: Array<File>,
  ): Promise<Array<{ uploadId: string; file: File }>> => {
    const fileDictionary = Object.fromEntries(
      files.map((file) => [file.name, file]),
    );

    // map file dictionary to body payload of the prepare upload request
    const items: Record<string, { itemContentType: string }> =
      Object.fromEntries(
        Object.entries(fileDictionary).map(([name, file]) => [
          name,
          { itemContentType: getFileMimeType(file) },
        ]),
      );

    type PrepareUploadResponse = {
      items: Record<string, { uploadId: string }>;
    };

    return fetch(`${baseUrl.value}/repository/${parentId}/manifest`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF8" },
      body: JSON.stringify({ items }),
    })
      .then((response) => response.json() as Promise<PrepareUploadResponse>)
      .then(({ items }) => {
        return Object.keys(items).map((name) => {
          const { uploadId } = items[name];
          const file = fileDictionary[name];
          return { uploadId, file };
        });
      });
  };

  const resolveFilePartUploadURL = async (
    uploadId: string,
    partNumber: number,
  ) => {
    type UploadURLResponse = {
      method: string;
      url: string;
      header: { Host: string };
    };

    const response = await fetch(
      `${baseUrl.value}/uploads/${uploadId}/parts/?partNumber=${partNumber}`,
      { method: "POST" },
    );

    return response.json() as Promise<UploadURLResponse>;
  };

  const completeUpload = async (
    uploadId: string,
    partIds: Record<number, string>,
  ) => {
    const response = await fetch(`${baseUrl.value}/uploads/${uploadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partIds),
    });

    return response.json();
  };

  const cancelUpload = async (uploadId: string) => {
    const response = await fetch(`${baseUrl.value}/uploads/${uploadId}`, {
      method: "DELETE",
    });

    return response.json();
  };

  const useUploadManagerResult = useUploadManager({
    resolveFilePartUploadURL,

    onFileUploadComplete: ({ uploadId, filePartIds }) => {
      promise
        .retryPromise(() => completeUpload(uploadId, filePartIds))
        .then(() => {
          options.onFileUploadComplete?.(uploadId, filePartIds);
        })
        .catch((error) => {
          consola.error("Error attempting to complete upload", { error });
          useUploadManagerResult.setFailed(uploadId, error as Error);
        });
    },

    onFileUploadFailed: (uploadId, error) => {
      options?.onFileUploadFailed?.(uploadId, error);
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

  const isPreparingUpload = ref(false);

  return {
    ...useUploadManagerResult,

    isPreparingUpload: computed(() => isPreparingUpload.value),

    start: async (parentId: string, files: File[]) => {
      try {
        isPreparingUpload.value = true;

        // TODO: HUB-9102: improve error handling here. see ticket for details
        const uploadPayload = await promise.retryPromise(() =>
          prepareUpload(parentId, getEnqueueableFiles(files)),
        );

        isPreparingUpload.value = false;

        useUploadManagerResult.start(parentId, uploadPayload);
      } catch (error) {
        // TODO: HUB-8152 process max file size error
        consola.error(error);
      }
    },

    cancel: (uploadId: string) => {
      useUploadManagerResult.cancel(uploadId);
      cancelUpload(uploadId).catch((error) => {
        consola.error("There was a problem canceling the upload", { error });
      });
    },
  };
};
