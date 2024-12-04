/* eslint-disable func-style */
import sleep from "../sleep";

export const DEFAULT_RETRY_DELAY_MS = 0;
export const DEFAULT_RETRY_COUNT = 5;

/**
 * Helper to add retry capability to an async function
 * @param fn async function
 * @param retryCount max number of retries. defaults to 5
 * @param retryDelayMS delay in-between retries in millisecs. defaults to 0
 * @param excludeError predicate fn to exclude specific errors from causing a retry
 */
export async function retryPromise<T>({
  fn,
  retryCount = DEFAULT_RETRY_COUNT,
  retryDelayMS = DEFAULT_RETRY_DELAY_MS,
  excludeError,
}: {
  fn: () => Promise<T>;
  retryCount?: number;
  retryDelayMS?: number;
  excludeError?: (error: Error) => boolean;
}) {
  try {
    return await fn();
  } catch (error) {
    if (excludeError?.(error as Error)) {
      throw error;
    }

    if (retryCount > 0) {
      await sleep(retryDelayMS);

      // eslint-disable-next-line no-return-await
      return await retryPromise({
        fn,
        retryCount: retryCount - 1,
        retryDelayMS,
        excludeError,
      });
    }

    throw error;
  }
}
