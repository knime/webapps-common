import { ref } from "vue";

import { $httpClient } from "../../../api";
import { globalContext } from "../../context";
import { bulkRequests } from "../../utils/bulkRequests";
import { showFailedToastForBulkRequests } from "../../utils/failToasts";
import { pluralize } from "../../utils/pluralize";

import type { DeleteItem } from "./types";

const bulkDeleteItems = async (itemIds: string[]) => {
  const promises = itemIds.map((id) => {
    return (
      $httpClient
        // eslint-disable-next-line new-cap
        .DELETE("/repository/{id}", {
          params: { path: { id }, query: { softDelete: true } },
        })
        .then(() => ({ result: id, error: null }))
        .catch((error) => ({ result: id, error }))
    );
  });

  const { succeeded, failed } = await bulkRequests({
    promises,
  });

  return { succeeded, failed };
};

const SUCCESS_MESSAGE_SUFFIX = "moved to trash";

export const useDeleteFeature = () => {
  const isDeletePending = ref(false);

  const triggerDelete = async (toBeDeletedItems: DeleteItem[]) => {
    isDeletePending.value = true;

    const { failed, succeeded } = await bulkDeleteItems(
      toBeDeletedItems.map((item) => item.id),
    );

    if (failed.length === 0) {
      globalContext.toastService().show({
        headline: `${pluralize(succeeded.length, "item")} ${SUCCESS_MESSAGE_SUFFIX}`,
        type: "success",
      });
    } else {
      showFailedToastForBulkRequests(
        SUCCESS_MESSAGE_SUFFIX,
        succeeded.length,
        failed,
      );
    }
  };

  return { triggerDelete };
};
