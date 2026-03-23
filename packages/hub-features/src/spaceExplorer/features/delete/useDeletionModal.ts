import { ref } from "vue";

import { useToasts } from "@knime/components";

import { showFailedToastForBulkRequests } from "../../utils/failToasts";
import { pluralize } from "../../utils/pluralize";

/**
 * @example
 * {
 *   type (String identifying the type of the item to delete (e.g. 'workflow'))
 *   id (Repository item id of the item to delete)
 *   name (The name of the item to delete)
 * }
 */
export type DeleteItem = {
  type: string;
  id: string;
  name: string;
};

const items = ref<DeleteItem[]>([]);
const showConfirmation = ref(false);
const pendingDelete = ref(false);

// FIXME: implement
const deleteItems = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ failed: any[]; succeeded: any[] }> => {
  throw new Error(`implement delete -> ${args}`);
};

export const useDeletionModal = () => {
  const close = () => {
    pendingDelete.value = false;
    showConfirmation.value = false;
    items.value = [];
  };
  const successMessageSuffix = "moved to trash";

  const onYes = async () => {
    pendingDelete.value = true;

    const { failed, succeeded } = await deleteItems({
      ids: items.value.map((item) => item.id),
      softDelete: true,
    });

    if (failed.length === 0) {
      useToasts().show({
        headline: `${pluralize(succeeded.length, "item")} ${successMessageSuffix}`,
        type: "success",
      });
    } else {
      showFailedToastForBulkRequests(
        successMessageSuffix,
        succeeded.length,
        failed,
      );
    }

    close();
  };

  const triggerDelete = async (toBeDeletedItems: DeleteItem[]) => {
    items.value = toBeDeletedItems;
    await onYes();
  };

  return {
    triggerDelete,
    internal: {
      onYes,
      close,
      items,
      showConfirmation,
      pendingDelete,
    },
  };
};
