import { type Ref, computed } from "vue";
// import { buildRepositoryPath } from "#shared/utils/buildClientPaths";

import { useToasts } from "@knime/components";
import { capitalize } from "@knime/utils";

import type { Space, WorkflowGroup } from "../../../api/types";
import type {
  BulkRequestFail,
  BulkRequestSuccess,
} from "../../utils/bulkRequests";
import { showFailedToastForBulkRequests } from "../../utils/failToasts";
import {
  hasCopyCapability,
  hasMoveCapability,
} from "../../utils/masonControls";
import { pluralize } from "../../utils/pluralize";

import { useDestinationPicker } from "./DestinationPicker/useDestinationPicker";
import { humanReadableSafeDate } from "./humanReadableSafeDate";
import { usePromptCollisionStrategies } from "./usePromptCollisionHandling";

const showSuccessToast = (
  operationText: "moved" | "copied",
  count: number,
  goToTargetPath?: string,
) => {
  const isSingleItem = count === 1;
  return useToasts().show({
    type: "success",
    headline: isSingleItem
      ? `${capitalize(operationText)}`
      : `${pluralize(count, "item")} ${operationText}.`,

    message: `The ${isSingleItem ? "item has" : "items have"} been ${operationText}.`,
    buttons: goToTargetPath
      ? [
          // FIXME: emit event OR navigate
          // {
          //   text: `Go to ${getBaseName(goToTargetPath)}`,
          //   to: buildRepositoryPath({
          //     path: goToTargetPath,
          //     type: "Space",
          //   }),
          // },
        ]
      : undefined,
  });
};

const showFailedOrSuccessToasts = <T>(
  operationText: "copied" | "moved",
  succeeded: BulkRequestSuccess<T>[],
  failed: BulkRequestFail<T>[],
  goToTargetPath?: string,
) => {
  if (failed.length > 0) {
    showFailedToastForBulkRequests(operationText, succeeded.length, failed);
  } else {
    showSuccessToast(operationText, succeeded.length, goToTargetPath);
  }
};

const { promptCollisionStrategies } = usePromptCollisionStrategies();
const { promptDestination, presets } = useDestinationPicker();

// FIXME: implement
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moveOrCopyItems = (...args: any[]) => {
  console.log("args :>> ", args);
  return Promise.resolve({ succeeded: [], failed: [], conflicts: [] });
};

type Options = {
  space: Ref<Space>;
  workflowGroup: Ref<WorkflowGroup>;
};

export const useMoveOrCopyOperations = (options: Options) => {
  // const workflowGroupStore = useWorkflowGroupStore();
  const masonControls = computed(() => options.space.value["@controls"]);

  const canCopyItems = computed(() =>
    hasCopyCapability(masonControls.value ?? {}),
  );

  const canMoveItems = computed(() =>
    hasMoveCapability(masonControls.value ?? {}),
  );

  type SimpleMoveOrCopyItem = { id: string; name: string };

  const copyOrMove = async (
    operation: "copy" | "move",
    selectedItems: SimpleMoveOrCopyItem[],
    targetCanonicalPath: string,
    goToTargetPath?: string,
  ) => {
    const operationText = operation === "copy" ? "copied" : "moved";
    const ids = selectedItems.map(({ id }) => id);

    const doTheCopyOrMove = (itemIds: string[], force = false, suffix = "") =>
      moveOrCopyItems({
        operation,
        ids: itemIds,
        targetCanonicalPath,
        force,
        suffix,
      });

    const { succeeded, failed, conflicts } = await doTheCopyOrMove(ids);

    // no conflicts just show toasts and exit
    if (conflicts.length === 0) {
      showFailedOrSuccessToasts(
        operationText,
        succeeded,
        failed,
        goToTargetPath,
      );
      return;
    }

    // handle conflicts
    const doTheRetry = async (force = false, suffix = "") => {
      // @ts-expect-error - remove after impl
      const failedIds = failed.map((s) => s.result);
      // @ts-expect-error // FIXME: TS config new ES syntax
      const failedWithoutConflicts = new Set(failed).difference(
        new Set(conflicts),
      );

      const { succeeded: retrySucceeded, failed: retryFailed } =
        await doTheCopyOrMove(failedIds, force, suffix);

      showFailedOrSuccessToasts(
        operationText,
        [...succeeded, ...retrySucceeded],
        [...failedWithoutConflicts, ...retryFailed],
        goToTargetPath,
      );
    };

    const strategy = await promptCollisionStrategies();

    if (strategy === "OVERWRITE") {
      await doTheRetry(true);
      return;
    }

    if (strategy === "AUTORENAME") {
      await doTheRetry(false, ` ${humanReadableSafeDate(new Date())}`);
      return;
    }

    if (strategy === "CANCEL" && succeeded.length > 0) {
      useToasts().show({
        headline: `Partial ${operation}`,
        message: `${pluralize(succeeded.length, "item")} ${operationText}, ${pluralize(failed.length, "item")} skipped due to name conflicts.`,
        type: "info",
      });
    }
  };

  const copyOrMoveAskForDestination = async (
    operation: "copy" | "move",
    selectedItems: SimpleMoveOrCopyItem[],
  ) => {
    const getPreset =
      operation === "copy"
        ? presets.getCopyPickerConfig
        : presets.getMovePickerConfig;

    const destinationPickerResult = await promptDestination(
      getPreset(
        options.workflowGroup.value.canonicalPath ?? "",
        selectedItems.map(({ name }) => name),
      ),
    );

    // only work with items - see validate
    if (destinationPickerResult?.type !== "item") {
      return;
    }

    const targetCanonicalPath = destinationPickerResult?.canonicalPath;
    const goToTargetPath = destinationPickerResult?.path;

    if (!targetCanonicalPath) {
      return;
    }

    await copyOrMove(
      operation,
      selectedItems,
      targetCanonicalPath,
      goToTargetPath,
    );
  };

  return {
    copyOrMove,
    copyOrMoveAskForDestination,
    canCopyItems,
    canMoveItems,
  };
};
