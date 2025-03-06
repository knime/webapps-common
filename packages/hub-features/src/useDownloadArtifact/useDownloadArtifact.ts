import { computed, ref } from "vue";
import { FetchError, type FetchOptions } from "ofetch";

import { sleep } from "@knime/utils";

import { DEFAULT_API_BASE_URL } from "../common/constants";
import { getFetchClient } from "../common/ofetchClient";
import { rfcErrors } from "../rfcErrors";

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
  downloadId: string;
  itemId: string;
  status: "READY" | "IN_PROGRESS" | "FAILED" | "CANCELLED";
  version?: ItemVersion;
  downloadUrl?: string;
  failureDetails?: string;
};

export type UseDownloadArtifactOptions = {
  /**
   * The maximum number of times to poll for the download URL. Default is `null` (no limit).
   */
  maxRetries?: number;
  /**
   * The interval in milliseconds between each poll. Default is `2000` ms.
   */
  pollingInterval?: number;
  /**
   * Custom options to pass to the fetch client.
   * @example { baseURL: "/_/api" }
   */
  customFetchClientOptions?: FetchOptions;
};

/**
 * This composable supports multiple concurrent downloads. Each time you call ```start```, the following behavior applies:
 *
 * 1. **Immediate-ready artifact**: If the first status check for the artifact returns `READY`, then there's no polling and no need
 *    to add it to `downloadItems`. The download URL is opened in the same tab immediately.
 *
 * 2. **Not-ready artifact**: If the artifact is not yet ready (e.g. needs zipping), then we add a record to `downloadItems` with status `IN_PROGRESS`
 *    and repeatedly poll until it becomes `READY`, the polling times out, or the user aborts.
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
 * // downloadItems (as a computed array) will reflect the current statuses.
 * ```
 */
export const useDownloadArtifact = (
  options: UseDownloadArtifactOptions = {},
) => {
  const downloadItems = ref<Record<string, DownloadItem>>({});
  const abortControllers: Record<string, AbortController> = {};

  const $ofetch = getFetchClient(options.customFetchClientOptions);
  const baseUrl =
    options.customFetchClientOptions?.baseURL ?? DEFAULT_API_BASE_URL;

  // Use fallback values if none are provided
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const pollingInterval = options.pollingInterval ?? DEFAULT_POLLING_INTERVAL;

  const cancel = (downloadId: string) => {
    const itemController = abortControllers[downloadId];
    if (itemController) {
      itemController.abort();
      delete abortControllers[downloadId];
    }
  };

  const removeItem = (downloadId: string) => {
    cancel(downloadId);
    delete downloadItems.value[downloadId];
  };

  const fetchDownloadStatus = ({
    downloadId,
    signal,
  }: {
    downloadId: string;
    signal?: AbortSignal;
  }) => {
    return $ofetch<ArtifactStatusResponse>(
      `${baseUrl}/downloads/${downloadId}/status`,
      {
        method: "GET",
        signal,
      },
    );
  };

  /**
   * Makes a request to the download status endpoint for the given download item.
   * Returns a boolean that is true if a terminal state has been reached (download is ready,
   * download failed, or user aborted download)
   * @param downloadId the `downloadId`
   * @param signal the abort signal passed to the request to be able to abort it
   * @returns a boolean indicating whether a terminal state has been reached
   */
  const handlePollingResult = async ({
    downloadId,
    signal,
  }: {
    downloadId: string;
    signal: AbortSignal;
  }) => {
    try {
      const statusResponse = await fetchDownloadStatus({
        downloadId,
        signal,
      });

      if (statusResponse?.status === "READY" && statusResponse?.downloadUrl) {
        downloadItems.value[downloadId].status = "READY";
        downloadItems.value[downloadId].downloadUrl =
          statusResponse.downloadUrl;
        window.open(statusResponse.downloadUrl, "_parent");
        return true;
      } else if (statusResponse?.status === "FAILED") {
        let details = "Download failed";
        if (statusResponse?.statusMessage) {
          details += `: ${statusResponse.statusMessage}`;
        }
        throw new Error(details);
      }
    } catch (error: unknown) {
      consola.error("Error fetching status:", error);
      // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
      const isAbortError =
        error instanceof DOMException && error.name === "AbortError";

      if (!isAbortError) {
        downloadItems.value[downloadId].status = "FAILED";
        downloadItems.value[downloadId].failureDetails =
          error instanceof Error ? error.message : (error as string);
      }
      return true;
    }
    return false;
  };

  const pollDownloadItem = async ({
    itemId,
    downloadId,
    version,
  }: {
    itemId: string;
    downloadId: string;
    version?: ItemVersion;
  }) => {
    const controller = new AbortController();
    abortControllers[downloadId] = controller;

    const signal = controller.signal;

    downloadItems.value[downloadId] = {
      itemId,
      ...(version && { version }),
      downloadId,
      status: "IN_PROGRESS",
    };

    const abortListener = () => {
      controller.signal.removeEventListener("abort", abortListener);
      if (!downloadItems.value[downloadId]) {
        return;
      }
      downloadItems.value[downloadId].status = "CANCELLED";
      downloadItems.value[downloadId].failureDetails =
        "Download was cancelled manually";
    };
    controller.signal.addEventListener("abort", abortListener);

    let tries = 0;
    // eslint-disable-next-line no-unmodified-loop-condition
    while (maxRetries === null || tries < maxRetries) {
      tries++;
      await sleep(pollingInterval);

      const isTerminalState = await handlePollingResult({ downloadId, signal });

      if (isTerminalState) {
        break;
      }
    }

    delete abortControllers[downloadId];

    if (maxRetries !== null && tries >= maxRetries) {
      downloadItems.value[downloadId].status = "FAILED";
      downloadItems.value[downloadId].failureDetails = "Download timed out";
    }
  };

  const start = async ({
    itemId,
    version,
  }: {
    itemId: string;
    version?: ItemVersion;
  }) => {
    try {
      const response = await $ofetch<RequestDownloadResponse>(
        `${baseUrl}/repository/${itemId}/artifact`,
        {
          method: "GET",
          query: { version },
        },
      );
      const downloadId = response.downloadId;

      const downloadStatusResponse = await fetchDownloadStatus({ downloadId });

      if (
        // download is ready immediately, no polling needed
        downloadStatusResponse?.status === "READY" &&
        downloadStatusResponse?.downloadUrl
      ) {
        window.open(downloadStatusResponse.downloadUrl, "_parent");
      } else {
        await pollDownloadItem({
          itemId,
          version,
          downloadId,
        });
      }
    } catch (error: unknown) {
      // here only errors thrown by the initial requests are caught;
      // errors occurring while polling will be handled in pollDownloadItem
      if (error instanceof FetchError) {
        throw rfcErrors.tryParse(error);
      }
      throw error;
    }
  };

  const totalItemsBeingZipped = computed(
    () =>
      Object.values(downloadItems.value).filter(
        ({ status }) => status === "IN_PROGRESS",
      ).length,
  );

  const resetState = () => {
    for (const [downloadId, controller] of Object.entries(abortControllers)) {
      controller?.abort();
      delete abortControllers[downloadId];
    }
    downloadItems.value = {};
  };

  const downloadItemsArray = computed(() => Object.values(downloadItems.value));

  return {
    /**
     * Initiates a download of the given itemId and version.
     */
    start,

    /**
     * Cancels the ongoing download for a given itemId (if any).
     * Sets the status in `downloadItems` to `CANCELLED`.
     */
    cancel,

    /**
     * Removes item from `downloadItems`.
     */
    removeItem,

    /**
     * A computed array of all current items that are being zipped and prepared for download.
     */
    downloadItems: downloadItemsArray,

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
