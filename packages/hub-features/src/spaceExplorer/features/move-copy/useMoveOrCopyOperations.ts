import { type ComputedRef, computed } from "vue";
import { StatusCodes } from "http-status-codes";

import { capitalize } from "@knime/utils";

import { $httpClient } from "../../../api";
import type {
  RepositoryItemAsMason,
  Space,
  WorkflowGroup,
} from "../../../api/types";
import { globalContext } from "../../context";
import type { HubFileExplorerItem } from "../../types";
import {
  type BulkRequestFail,
  type BulkRequestSuccess,
  bulkRequests,
} from "../../utils/bulkRequests";
import { showFailedToastForBulkRequests } from "../../utils/failToasts";
import { logger } from "../../utils/logger";
import {
  hasCopyCapability,
  hasMoveCapability,
} from "../../utils/masonControls";
import { getBaseName, getParentPath } from "../../utils/paths";
import { pluralize } from "../../utils/pluralize";

import { useDestinationPicker } from "./DestinationPicker/useDestinationPicker";
import { humanReadableSafeDate } from "./humanReadableSafeDate";
import { usePromptCollisionStrategies } from "./usePromptCollisionHandling";

type NavigateToPathFn = (path: string) => void;

type SuccessToastConfig = {
  finalDestinationPath: string;
  navigate: NavigateToPathFn;
};

const showSuccessToast = (
  operationText: "moved" | "copied",
  count: number,
  config?: SuccessToastConfig,
) => {
  const isSingleItem = count === 1;
  return globalContext.toastService().show({
    type: "success",
    headline: isSingleItem
      ? `${capitalize(operationText)}`
      : `${pluralize(count, "item")} ${operationText}.`,

    message: `The ${isSingleItem ? "item has" : "items have"} been ${operationText}.`,
    buttons: config
      ? [
          {
            text: `Go to ${getBaseName(config.finalDestinationPath)}`,
            callback: () => config.navigate(config.finalDestinationPath),
          },
        ]
      : undefined,
  });
};

const showFailedOrSuccessToasts = <T>(
  operationText: "copied" | "moved",
  succeeded: BulkRequestSuccess<T>[],
  failed: BulkRequestFail<T>[],
  successToastConfig?: SuccessToastConfig,
) => {
  if (failed.length > 0) {
    showFailedToastForBulkRequests(operationText, succeeded.length, failed);
  } else {
    showSuccessToast(operationText, succeeded.length, successToastConfig);
  }
};

const { promptCollisionStrategies } = usePromptCollisionStrategies();
const { promptDestination, presets } = useDestinationPicker();

const move = (itemId: string, canonicalPath: string, force = false) =>
  // eslint-disable-next-line new-cap
  $httpClient.PUT("/repository/{id}/path", {
    params: { path: { id: itemId } },
    body: { canonicalPath, force },
  });

const copy = (itemId: string, canonicalPath: string, force = false) =>
  // eslint-disable-next-line new-cap
  $httpClient.POST("/repository/{id}/copies", {
    params: { path: { id: itemId } },
    body: { canonicalPath, force },
  });

const bulkCopyOrMove = async (params: {
  itemsById: Record<string, RepositoryItemAsMason>;
  operation: "move" | "copy";
  ids: string[];
  targetCanonicalPath: string;
  force?: boolean;
  suffix?: string;
}) => {
  const request = params.operation === "move" ? move : copy;

  const promises = params.ids.map((id) => {
    const item = params.itemsById[id];
    const fullTargetPath = `${params.targetCanonicalPath}/${getBaseName(item.path)}${params.suffix}`;

    return request(id, fullTargetPath, params.force)
      .then(() => ({ result: id, error: null }))
      .catch((error) => ({ result: id, error }));
  });

  const { succeeded, failed } = await bulkRequests({
    promises,
  });

  const conflicts = failed.filter(
    (failure) => failure.rfcError.data.status === StatusCodes.CONFLICT,
  );

  return { succeeded, failed, conflicts };
};

type Options = {
  space: ComputedRef<Space | undefined>;
  workflowGroup: ComputedRef<WorkflowGroup | undefined>;
  workflowGroupChildrenById: ComputedRef<Record<string, RepositoryItemAsMason>>;
  currentItems: ComputedRef<HubFileExplorerItem[]>;
};

type SimpleMoveOrCopyItem = { id: string; name: string };

export const useMoveOrCopyFeature = (options: Options) => {
  const canCopyItems = computed(() =>
    hasCopyCapability(options.space.value?.["@controls"] ?? {}),
  );

  const canMoveItems = computed(() =>
    hasMoveCapability(options.space.value?.["@controls"] ?? {}),
  );

  const copyOrMoveToPath = async (
    operation: "copy" | "move",
    referenceItems: SimpleMoveOrCopyItem[],
    targetCanonicalPath: string,
    successToastConfig?: SuccessToastConfig,
  ) => {
    const operationText = operation === "copy" ? "copied" : "moved";
    const ids = referenceItems.map(({ id }) => id);

    const run = (itemIds: string[], force = false, suffix = "") =>
      bulkCopyOrMove({
        itemsById: options.workflowGroupChildrenById.value,
        operation,
        ids: itemIds,
        targetCanonicalPath,
        force,
        suffix,
      });

    const { succeeded, failed, conflicts } = await run(ids);

    // no conflicts just show toasts and exit
    if (conflicts.length === 0) {
      showFailedOrSuccessToasts(
        operationText,
        succeeded,
        failed,
        successToastConfig,
      );
      return;
    }

    // handle conflicts
    const retry = async (
      params: { force?: boolean; suffix?: string } = {
        force: false,
        suffix: "",
      },
    ) => {
      const failedIds = failed.map((s) => s.result);
      const failedWithoutConflicts = new Set(failed).difference(
        new Set(conflicts),
      );

      const { succeeded: retrySucceeded, failed: retryFailed } = await run(
        failedIds,
        params.force,
        params.suffix,
      );

      showFailedOrSuccessToasts(
        operationText,
        [...succeeded, ...retrySucceeded],
        [...failedWithoutConflicts, ...retryFailed],
        successToastConfig,
      );
    };

    const strategy = await promptCollisionStrategies();

    if (strategy === "OVERWRITE") {
      await retry({ force: true });
      return;
    }

    if (strategy === "AUTORENAME") {
      await retry({
        force: false,
        suffix: ` ${humanReadableSafeDate(new Date())}`,
      });
      return;
    }

    if (strategy === "CANCEL" && succeeded.length > 0) {
      globalContext.toastService().show({
        headline: `Partial ${operation}`,
        message: `${pluralize(succeeded.length, "item")} ${operationText}, ${pluralize(failed.length, "item")} skipped due to name conflicts.`,
        type: "info",
      });
    }
  };

  const copyOrMovePromptDestination = async (
    operation: "copy" | "move",
    referenceItems: SimpleMoveOrCopyItem[],
    navigateToPath: NavigateToPathFn,
  ) => {
    if (!options.workflowGroup.value) {
      logger().error("Root workflow item not found");
      return;
    }

    const getPreset =
      operation === "copy"
        ? presets.getCopyPickerConfig
        : presets.getMovePickerConfig;

    const destinationPickerResult = await promptDestination(
      getPreset(
        options.workflowGroup.value.canonicalPath ?? "",
        referenceItems.map(({ name }) => name),
      ),
    );

    // only work with items - see validate
    if (destinationPickerResult?.type !== "item") {
      return;
    }

    const targetCanonicalPath = destinationPickerResult?.canonicalPath;
    const finalDestinationPath = destinationPickerResult?.path;

    if (!targetCanonicalPath) {
      return;
    }

    await copyOrMoveToPath(operation, referenceItems, targetCanonicalPath, {
      navigate: navigateToPath,
      finalDestinationPath,
    });
  };

  const copyOrMoveViaDrag = async ({
    sourceItems,
    targetItem,
  }: {
    sourceItems: string[];
    targetItem: string;
  }) => {
    if (!options.workflowGroup.value) {
      logger().error("Root workflow item not found");
      return;
    }

    const isBack = targetItem === "..";
    const targetCanonicalPath = isBack
      ? getParentPath({
          repositoryPath: options.workflowGroup.value.canonicalPath ?? "",
        })
      : options.workflowGroupChildrenById.value?.[targetItem]?.canonicalPath;

    if (!targetCanonicalPath) {
      logger().error("targetCanonicalPath to move to is not valid");
      return;
    }
    const referenceItems = options.currentItems.value.filter((item) =>
      sourceItems.includes(item.id),
    );
    await copyOrMoveToPath("move", referenceItems, targetCanonicalPath);
  };

  return {
    copyOrMoveViaDrag,
    copyOrMovePromptDestination,
    canCopyItems,
    canMoveItems,
  };
};
