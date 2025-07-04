import { computed, ref } from "vue";
import { FetchError, type FetchOptions } from "ofetch";

import type { DownloadItem as DownloadItemExternal } from "@knime/components";
import { sleep } from "@knime/utils";

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

// Initial request can have either download url (if it can be downloaded immediately) or download id (to poll for the status)
type RequestDownloadResponse =
  | {
      downloadId: string;
    }
  | {
      downloadUrl: string;
    };

// type guard
const hasDownloadUrl = (
  response: RequestDownloadResponse,
): response is { downloadUrl: string } => {
  return "downloadUrl" in response;
};

/**
 * The version of the artifact to download.
 */
type ItemVersion = number | "current-state" | "most-recent";

/**
 * Tracks the state of each concurrent download.
 */
type DownloadItem = DownloadItemExternal & {
  itemId: string;
  version?: ItemVersion;
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

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

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
  const $ofetch = getFetchClient(options.customFetchClientOptions);

  const downloadItems = ref<Record<string, DownloadItem>>({});
  const abortControllers: Record<string, AbortController> = {};

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
    return $ofetch<ArtifactStatusResponse>(`/downloads/${downloadId}/status`, {
      method: "GET",
      signal,
    });
  };

  const openDownload = (downloadUrl: string) => {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = downloadUrl;
    a.download = "";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        // open download in a new tab
        openDownload(statusResponse.downloadUrl);
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
      const isAborted =
        isAbortError(error) ||
        (error instanceof FetchError && isAbortError(error.cause));

      if (!isAborted) {
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
    name,
  }: {
    itemId: string;
    downloadId: string;
    version?: ItemVersion;
    name: string;
  }) => {
    const controller = new AbortController();
    abortControllers[downloadId] = controller;

    const signal = controller.signal;

    let itemName = `${name}`;
    if (version) {
      itemName += ` (${version})`;
    }

    downloadItems.value[downloadId] = {
      itemId,
      ...(version && { version }),
      downloadId,
      name: itemName,
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
    name,
  }: {
    itemId: string;
    name: string;
    version?: ItemVersion;
  }) => {
    try {
      const response = await $ofetch<RequestDownloadResponse>(
        `/repository/${itemId}/artifact`,
        {
          method: "GET",
          query: { version },
        },
      );

      // if download is ready, open url immediately
      if (hasDownloadUrl(response)) {
        openDownload(response.downloadUrl);
        return;
      }

      // otherwise start polling download status
      await pollDownloadItem({
        itemId,
        version,
        downloadId: response.downloadId,
        name,
      });
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

    /**
     * Opens a download from the given url
     */
    openDownload,
  };
};
