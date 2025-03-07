import { ref } from "vue";
import { FetchError, type FetchOptions } from "ofetch";

import { sleep } from "@knime/utils";

import { getFetchClient } from "../common/ofetchClient";
import { rfcErrors } from "../rfcErrors";

const DEFAULT_API_BASE_URL = "/_/api";
const DEFAULT_MAX_RETRIES = null;
const DEFAULT_POLLING_INTERVAL = 2000;

type ArtifactStatus = {
  downloadId?: string;
  status?: string;
  statusMessage?: string;
  lastUpdated?: string;
  downloadUrl?: string;
};

type RequestDownloadResponse = {
  downloadId: string;
};

type ItemVersion = number | "current-state" | "most-recent";

/**
 *  This composable provides a loading state and a method to download an artifact from the repository and poll for the download URL.
 *  The download is initiated by calling the `downloadArtifact` method with the artifact ID.
 *  The composable will poll the download status until a terminal download status is reached or the polling timed out. On success, it will start the download in the browser, otherwise, an error toast is displayed.
 *
 *  Usage Example:
 *  ```
 *  const { isDownloading, downloadArtifact, abort } = useDownloadArtifact({
 *    maxRetries: 10, // Optional: The maximum number of times to poll for the download URL.
 *    pollingInterval: 2000, // Optional: The interval in milliseconds between each poll.
 *    customFetchClientOptions: // Optional: Custom options to pass to the fetch client.
 *  });
 *
 *  await downloadArtifact({ itemId: "1234", version: 1 });
 *
 *  // If needed, you can call abort() to cancel.
 *  abort();
 *  ```
 */
export const useDownloadArtifact = (
  options: {
    /**
     * The maximum number of times to poll for the download URL.
     */
    maxRetries?: number;
    /**
     * The interval in milliseconds between each poll.
     */
    pollingInterval?: number;
    /**
     * Custom options to pass to the fetch client.
     * @example { baseURL: "/_/api" }
     */
    customFetchClientOptions?: FetchOptions;
  } = {},
) => {
  const isDownloading = ref(false);
  const downloadPath = ref("");

  // We can store a single AbortController in the composable.
  // If you want a new controller per call (e.g., allow multiple concurrent downloads),
  // create it inside `downloadArtifact` instead.
  const abortController = ref<AbortController | null>(null);

  const $ofetch = getFetchClient(options.customFetchClientOptions);
  const baseUrl =
    options.customFetchClientOptions?.baseURL ?? DEFAULT_API_BASE_URL;

  // Use fallback values if none are provided
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const pollingInterval = options.pollingInterval ?? DEFAULT_POLLING_INTERVAL;

  /**
   * Allows the caller to abort the current fetch & polling.
   */
  const abort = () => {
    if (abortController.value) {
      abortController.value.abort();
      abortController.value = null;
    }
  };

  /**
   * Poll the artifact status until it's ready (or we run out of retries).
   * Once ready, open the download link in the same tab.
   */
  const checkAndDownloadItem = async (
    downloadId: string,
    signal: AbortSignal,
  ) => {
    let tries = 0;

    while (maxRetries === null || tries < maxRetries) {
      // If the user has aborted, stop immediately.
      if (signal.aborted) {
        // You can throw here if you prefer:
        throw new FetchError("Download aborted by user");
      }

      tries++;

      try {
        const statusResponse = await $ofetch<ArtifactStatus>(
          `${baseUrl}/downloads/${downloadId}/status`,
          {
            method: "GET",
            signal, // Pass the signal so the request can be aborted
          },
        );

        if (statusResponse?.status === "READY" && statusResponse?.downloadUrl) {
          downloadPath.value = statusResponse.downloadUrl;
          window.open(downloadPath.value, "_parent");
          return;
        }
      } catch (error) {
        consola.error("Error fetching status", error);
        if (error instanceof FetchError) {
          throw rfcErrors.tryParse(error);
        }
        throw error;
      }

      await sleep(pollingInterval);
    }

    // If we exit the loop without returning, we never got 'READY'.
    throw new FetchError(`Download not ready after ${maxRetries} attempts`);
  };

  /**
   * Initiates the download request and starts polling for the download URL.
   */
  const downloadArtifact = async ({
    itemId,
    version,
  }: {
    itemId: string;
    version?: ItemVersion;
  }) => {
    isDownloading.value = true;

    // Create a new AbortController each time downloadArtifact is called
    abortController.value = new AbortController();
    const signal = abortController.value.signal;

    try {
      const downloadResponse = await $ofetch<RequestDownloadResponse>(
        `${baseUrl}/repository/${itemId}/artifact`,
        {
          method: "GET",
          query: { version },
          signal,
        },
      );

      if (downloadResponse?.downloadId) {
        await checkAndDownloadItem(downloadResponse.downloadId, signal);
      }
    } catch (error) {
      consola.error("Error fetching artifact", error);

      if (error instanceof FetchError) {
        throw rfcErrors.tryParse(error);
      }
      throw error;
    } finally {
      isDownloading.value = false;
      abortController.value = null;
    }
  };

  return {
    /**
     * Reactive ref that indicates if a download is in progress.
     */
    isDownloading,
    /**
     * The download method of the artifact.
     * @param itemId The item ID of the artifact to download.
     * @param version The version of the artifact to download.
     */
    downloadArtifact,
    /**
     * Cancels the current download.
     */
    abort,
  };
};
