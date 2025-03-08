import { computed, ref } from "vue";
import { FetchError, type FetchOptions } from "ofetch";

import { sleep } from "@knime/utils";

import { getFetchClient } from "../common/ofetchClient";
import { rfcErrors } from "../rfcErrors";

const DEFAULT_API_BASE_URL = "/_/api";
const DEFAULT_MAX_RETRIES = null;
const DEFAULT_POLLING_INTERVAL = 2000;

type ArtifactStatusResponse = {
  downloadId?: string;
  status?: string;
  statusMessage?: string;
  lastUpdated?: string;
  downloadUrl?: string;
};

type RequestDownloadResponse = {
  downloadId: string;
};

/**
 * The version of the artifact to download.
 */
type ItemVersion = number | "current-state" | "most-recent";

/**
 * Tracks the state of each concurrent download.
 */
type DownloadItem = {
  /**
   * The item ID of the artifact being downloaded.
   */
  itemId: string;

  /**
   * Current status of the download:
   *  - ```IN_PROGRESS```: still polling or retrieving
   *  - ```READY```: the artifact is ready and the URL has been opened in the browser
   *  - ```FAILED```: some error occurred
   *  - ```CANCELED```: user aborted
   */
  status: "READY" | "IN_PROGRESS" | "FAILED" | "CANCELED";

  /**
   * The downloadId returned by the initial fetch call.
   */
  downloadId: string;

  /**
   * The final download URL (populated only when status === ```READY```).
   */
  downloadUrl: string;
};

/**
 *This composable supports multiple concurrent downloads. Each time you call ```start```, the following behavior applies:
 * 1. **Single-file artifact**: If the artifact is just one file, it downloads immediately and opens the download URL in the same tab.
 * 2. **Zipped artifact**: If the artifact needs to be zipped, a new item is added to ```downloadItems``` with a status of ```IN_PROGRESS```. The composable then polls until the status becomes ```READY``` (success), the polling times out, or the user aborts.
 *
 * **Usage**:
 * ```
 * const { start, cancel, downloadItems } = useDownloadArtifact({ ...options });
 *
 * // start a download
 * await start({ itemId: "1234", version: 1 });
 *
 * // if needed, cancel it:
 * cancel("1234");
 *
 * // The array downloadItems will reflect the current status of each item.
 * ```
 */

export const useDownloadArtifact = (
  options: {
    /**
     * The maximum number of times to poll for the download URL. Default is ```null``` (no limit).
     */
    maxRetries?: number;
    /**
     * The interval in milliseconds between each poll. Default is ```2000``` ms.
     */
    pollingInterval?: number;
    /**
     * Custom options to pass to the fetch client.
     * @example { baseURL: "/_/api" }
     */
    customFetchClientOptions?: FetchOptions;
  } = {},
) => {
  // Reactive array holding the status of all concurrent downloads
  const downloadItems = ref<DownloadItem[]>([]);

  // We store one AbortController per itemId, allowing independent cancelation
  const abortControllers = new Map<string, AbortController>();

  const $ofetch = getFetchClient(options.customFetchClientOptions);
  const baseUrl =
    options.customFetchClientOptions?.baseURL ?? DEFAULT_API_BASE_URL;

  // Use fallback values if none are provided
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const pollingInterval = options.pollingInterval ?? DEFAULT_POLLING_INTERVAL;

  /**
   * Helper to update an existing ```DownloadItem```'s status by ```itemId```.
   */
  const updateItemStatus = (
    itemId: string,
    newStatus: DownloadItem["status"],
  ) => {
    const item = downloadItems.value.find((i) => i.itemId === itemId);
    if (item) {
      item.status = newStatus;
    }
  };

  /**
   * Helper to update the ```downloadUrl``` on an existing ```DownloadItem```.
   */
  const updateItemUrl = (itemId: string, downloadUrl: string) => {
    const item = downloadItems.value.find((i) => i.itemId === itemId);
    if (item) {
      item.downloadUrl = downloadUrl;
    }
  };

  /**
   * Cancels the download for a specific itemId (if in progress).
   * - Aborts the network requests.
   * - Sets the item status to ```CANCELED```.
   */
  const cancel = (itemId: string) => {
    const itemController = abortControllers.get(itemId);
    if (itemController) {
      itemController.abort(); // Abort any ongoing fetch or polling
      abortControllers.delete(itemId);

      updateItemStatus(itemId, "CANCELED");
    }
  };

  /**
   * Poll the artifact status until it's READY (or we run out of retries).
   * Once ready, open the download link in the same tab.
   */
  const pollDownloadItem = async (itemId: string, downloadId: string) => {
    const controller = abortControllers.get(itemId);
    if (!controller) {
      return;
    } // In case it was aborted immediately

    const signal = controller.signal;
    let tries = 0;
    let isAddedToDownloadItems = false;

    while (maxRetries === null || tries < maxRetries) {
      if (signal.aborted) {
        throw new FetchError("Download cancelled by user");
      }
      tries++;
      try {
        const statusResponse = await $ofetch<ArtifactStatusResponse>(
          `${baseUrl}/downloads/${downloadId}/status`,
          {
            method: "GET",
            signal,
          },
        );

        if (statusResponse?.status === "READY" && statusResponse?.downloadUrl) {
          if (isAddedToDownloadItems) {
            updateItemStatus(itemId, "READY");
            updateItemUrl(itemId, statusResponse.downloadUrl);
          }

          window.open(statusResponse.downloadUrl, "_parent");
          return;
        }

        if (!isAddedToDownloadItems) {
          downloadItems.value.push({
            itemId,
            status: "IN_PROGRESS",
            downloadId,
            downloadUrl: "",
          });
          isAddedToDownloadItems = true;
        }
      } catch (error) {
        consola.error("Error fetching status:", error);
        if (error instanceof FetchError) {
          throw rfcErrors.tryParse(error);
        }
        throw error;
      }

      await sleep(pollingInterval);
    }

    // If we got here, we never found a READY status and max tries was enabled
    throw new FetchError(`Download not ready after ${maxRetries} attempts.`);
  };

  // Initiates the download request and starts polling for the download URL.
  const start = async ({
    itemId,
    version,
  }: {
    itemId: string;
    version?: ItemVersion;
  }) => {
    const controller = new AbortController();
    abortControllers.set(itemId, controller);
    const signal = controller.signal;

    try {
      const response = await $ofetch<RequestDownloadResponse>(
        `${baseUrl}/repository/${itemId}/artifact`,
        {
          method: "GET",
          query: { version },
          signal,
        },
      );

      if (response?.downloadId) {
        // updateItemDownloadId(itemId, response.downloadId);
        await pollDownloadItem(itemId, response.downloadId);
      }
    } catch (error: any) {
      // If it's an abort error, we've already marked it as "CANCELED" above
      if (error?.message === "Download cancelled by user") {
        // The status has already been set to CANCELED inside `cancel()`
        return;
      }
      // else we assume it's a failure.
      consola.error("Error fetching artifact:", error);

      // If the download was not aborted, mark the item as FAILED
      updateItemStatus(itemId, "FAILED");

      if (error instanceof FetchError) {
        throw rfcErrors.tryParse(error);
      }
      throw error;
    } finally {
      //  Clean up the AbortController if it wasn't already removed by abort()
      abortControllers.delete(itemId);
    }
  };

  const totalItemsBeingZipped = computed(
    () =>
      downloadItems.value.filter((item) => item.status === "IN_PROGRESS")
        .length,
  );

  const resetState = () => {
    downloadItems.value = [];
    abortControllers.forEach((controller) => controller.abort());
    abortControllers.clear();
  };

  return {
    /**
     * Initiates a download of the given itemId and version.
     * The status is tracked in ```downloadItems```.
     */
    start,
    /**
     * Cancels the ongoing download for a given itemId (if any).
     * Sets the status in ```downloadItems``` to ```CANCELED```.
     */
    cancel,
    /**
     * A reactive array of downloads, each with its own status and IDs.
     */
    downloadItems,
    /**
     * The total number of zipping items in progress.
     */
    totalItemsBeingZipped,
    /**
     * Resets the state of the composable, clearing all downloads and controllers.
     */
    resetState,
  };
};
