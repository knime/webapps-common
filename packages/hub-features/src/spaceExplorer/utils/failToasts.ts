import { globalContext } from "../context";

import type { BulkRequestFail } from "./bulkRequests";
import { pluralize } from "./pluralize";

export const showFailedToastForBulkRequests = <T>(
  operationText: string,
  succeededCount: number,
  failed: BulkRequestFail<T>[],
) => {
  const message = failed
    .map((failure) => failure.rfcError.data.title)
    .join("\n");
  if (succeededCount > 0) {
    globalContext.toastService().show({
      headline: `${pluralize(succeededCount, "item")} ${operationText} / ${failed.length} failed`,
      message,
      type: "warning",
    });
  } else {
    globalContext.toastService().show({
      headline: `${pluralize(failed.length, "item")} couldn’t be ${operationText}`,
      message,
      type: "error",
    });
  }
};
