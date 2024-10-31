export class AbortError extends Error {}

/**
 * Helper to create an abortable promise. Returns an AbortController and a Function
 * that you can pass your async handler to. Whenever the AbortController signal is
 * aborted then the async handler's promise will reject with an AbortError
 *
 * Example:
 * ```
 * import { abortUtils } from "@knime/utils"
 * const myFetchCall = async (params...) => {...};
 *
 * try {
 *   const { runAbortablePromise, abortController } = createAbortablePromise(() =>
 *     myFetchCall(params...),
 *   );
 * } catch (e) {
 *   if (e instanceof abortUtils.AbortError) {
 *     console.info('ignore due to abort');
 *     return;
 *   }
 * }
 *
 * // somewhere else (while request is in-flight)
 * abortController.abort(new abortUtils.AbortError('reason here'))
 * ```
 */
export const createAbortablePromise = () => {
  const abortController: AbortController = new AbortController();

  const runAbortablePromise = <T = unknown>(request: () => Promise<T>) => {
    return new Promise<T>((resolve, reject) => {
      // abort logic
      const abortListener = ({ target }: Event) => {
        abortController.signal.removeEventListener("abort", abortListener);
        const reason = (target as AbortSignal).reason;
        reject(reason instanceof AbortError ? reason : new AbortError(reason));
      };

      // the actual call
      request()
        .then(resolve)
        .catch((error) => {
          if (error instanceof AbortError) {
            return;
          }

          reject(error instanceof Error ? error : new Error(error));
        });

      abortController.signal.addEventListener("abort", abortListener);
    });
  };

  return { abortController, runAbortablePromise };
};
