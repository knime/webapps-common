import { ref } from "vue";
import { FetchError, type FetchOptions } from "ofetch";

import { getFetchClient } from "../common/ofetchClient";
import { rfcErrors } from "../rfcErrors";

const DEFAULT_API_BASE_URL = "/_/api";

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
 * The composable will poll the download status until it's ready, at which point it will open the download link in a same tab.
 *
 * Usage Example:
 * ```
 * const { isDownloading, downloadArtifact } = useDownloadArtifact({
 *      maxRetries: 10, // Optional: The maximum number of times to poll for the download URL.
 *      pollingInterval: 2000, // Optional: The interval in milliseconds between each poll.
 *      customFetchClientOptions: // Optional: Custom options to pass to the fetch client.
 * });
 *
 * await downloadArtifact({ itemId: "1234", version: 1 });
 * ```
 *
 *
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

  const $ofetch = getFetchClient(options.customFetchClientOptions);
  const baseUrl =
    options.customFetchClientOptions?.baseURL ?? DEFAULT_API_BASE_URL;

  // Use fallback values if none are provided
  const maxRetries = options.maxRetries ?? null;
  const pollingInterval = options.pollingInterval ?? 2000;

  /**
   * Poll the artifact status until it's ready (or we run out of retries).
   * Once ready, open the download link in a new tab.
   */
  const checkAndDownloadItem = (downloadId: string) => {
    let tries = 0;

    return new Promise<void>((resolve, reject) => {
      const poll = async () => {
        tries++;

        try {
          const statusResponse = await $ofetch<ArtifactStatus>(
            `${baseUrl}/downloads/${downloadId}/status`,
            {
              method: "GET",
            },
          );

          if (
            statusResponse?.status === "READY" &&
            statusResponse?.downloadUrl
          ) {
            downloadPath.value = statusResponse.downloadUrl;
            window.open(downloadPath.value, "_parent");
            resolve();
            return;
          }

          //  If the download is not ready, poll again after the interval.
          if (!maxRetries || tries < maxRetries) {
            setTimeout(poll, pollingInterval);
          } else {
            reject(
              new FetchError(
                `Download not ready after ${maxRetries} attempts.`,
              ),
            );
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  };

  /**
   * Initiates the download request and starts polling for to get download URL.
   */
  const downloadArtifact = async ({
    itemId,
    version,
  }: {
    itemId: string;
    version?: ItemVersion;
  }) => {
    isDownloading.value = true;

    try {
      const downloadResponse = await $ofetch<RequestDownloadResponse>(
        `${baseUrl}/repository/${itemId}/artifact`,
        {
          method: "GET",
          query: {
            version,
          },
        },
      );

      if (downloadResponse?.downloadId) {
        await checkAndDownloadItem(downloadResponse.downloadId);
      }
    } catch (error) {
      consola.error("Error fetching", error);
      // Rethrow the errors to be handled by toast in hub
      if (error instanceof FetchError) {
        throw rfcErrors.tryParse(error);
      }

      throw error;
    } finally {
      isDownloading.value = false;
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
  };
};
