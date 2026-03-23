import type { FetchError } from "ofetch";

import { rfcErrors } from "../../../rfcErrors";

export type BulkRequestSuccess<T> = { result: T; error: null };
export type BulkRequestFail<T> = {
  result: T;
  error: FetchError;
  rfcError: InstanceType<typeof rfcErrors.RFCError>;
};

/**
 * Helper to call multiple requests (e.g. to catalog) and implement the return
 * error method to be able to provide data (e.g. the id) also for failed ones to do retry or overwrite (force).
 */
export const bulkRequests = async <T>({
  promises,
}: {
  promises: Promise<BulkRequestSuccess<T> | BulkRequestFail<T>>[];
}) => {
  const settledPromises = await Promise.allSettled(promises);
  const promiseResult = settledPromises
    .filter((p) => p.status === "fulfilled")
    .map((p) => p.value);

  const succeeded = promiseResult.filter((p) => p.error === null);
  const failedRaw = promiseResult.filter((p) => p.error !== null);

  const failed = failedRaw.map((failure) => ({
    ...failure,
    rfcError:
      rfcErrors.tryParse(failure.error) ??
      new rfcErrors.RFCError({ title: failure.error.message }),
  }));

  return {
    succeeded,
    failed,
  };
};
