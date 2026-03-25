import type { ComputedRef } from "vue";

import { $httpClient } from "../../../api";
import type { WorkflowGroup } from "../../../api/types";
import { rfcErrors } from "../../../rfcErrors";
import type { HubFileExplorerItem } from "../../types";
import { logger } from "../../utils/logger";

const doRenameRequest = async (
  rootItem: WorkflowGroup,
  renamedItem: { id: string; newName: string },
  force = false,
) => {
  if (!rootItem?.canonicalPath) {
    consola.error(
      "renameItem failed: current folder is not set or has no canonicalPath",
    );
    return;
  }

  const targetCanonicalPath = `${rootItem.canonicalPath}/${renamedItem.newName}`;
  try {
    // eslint-disable-next-line new-cap
    await $httpClient.PUT("/repository/{id}/path", {
      params: { path: { id: renamedItem.id } },
      body: { canonicalPath: targetCanonicalPath, force },
    });
  } catch (error) {
    const rfcError = rfcErrors.tryParse(error);

    if (rfcError) {
      rfcErrors.toToast({ headline: "Rename failed", rfcError });
    }

    throw error;
  }
};

type Options = {
  rootItem: ComputedRef<WorkflowGroup | undefined>;
  currentItems: ComputedRef<HubFileExplorerItem[]>;
};

export const useRenameFeature = (options: Options) => {
  const handleRename = async ({
    itemId,
    newName,
  }: {
    itemId: string;
    newName: string;
  }) => {
    const targetItem = options.currentItems.value.find(
      (item) => item.id === itemId,
    );

    if (!targetItem) {
      logger().error("Could not find item to rename!");
      return;
    }

    if (!options.rootItem.value) {
      logger().error("Item's parent not found");
      return;
    }

    const oldName = targetItem.name;
    try {
      // optimistic update
      targetItem.name = newName;

      await doRenameRequest(options.rootItem.value, {
        id: targetItem.id,
        newName,
      });
    } catch (e) {
      // revert optimistic update
      targetItem.name = oldName;
      logger().error(e);
    }
  };

  return { handleRename };
};
