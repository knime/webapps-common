import { computed, ref } from "vue";

import { promise as PromiseUtils } from "@knime/utils";

import type { SpaceTreeSelection } from "./SpaceTree.vue";

export type DestinationPickerConfig = {
  headline?: string;
  description?: string;
  validate: (selection: SpaceTreeSelection) => {
    valid: boolean;
    hint?: string;
  };
};
export type DestinationPickerResult = SpaceTreeSelection;

const isActive = ref(false);
const activePickerModalConfig = ref<DestinationPickerConfig | null>(null);
const unwrappedPromise = ref(
  PromiseUtils.createUnwrappedPromise<DestinationPickerResult>(),
);

const defaults = {
  headline: "Destination",
};

const validateSelectedItem = (
  operation: "move" | "copy",
  selection: SpaceTreeSelection,
  sourceCanonicalPath: string,
  itemsBaseNames: string[],
) => {
  if (!selection) {
    return { valid: false };
  }

  const isGroup = selection.type === "group";

  const isWorkflowContainer =
    selection.type === "item" && selection.isWorkflowContainer;

  const isSameFolder =
    selection.canonicalPath && sourceCanonicalPath === selection.canonicalPath;

  const itemAsTargetChosen = itemsBaseNames.some((name) =>
    selection.canonicalPath?.startsWith([sourceCanonicalPath, name].join("/")),
  );

  if (isGroup) {
    return { valid: false };
  }

  if (!isWorkflowContainer) {
    return {
      valid: false,
      hint: "Choose a space or folder.",
    };
  }

  if (!selection.isWriteable) {
    return {
      valid: false,
      hint: "This space is readonly.",
    };
  }

  if (isSameFolder) {
    return {
      valid: false,
      hint: "Choose a space or folder different to the current one.",
    };
  }

  if (itemAsTargetChosen) {
    return {
      valid: false,
      hint: `Can't ${operation} item into itself. Choose another destination.`,
    };
  }

  return { valid: true };
};

const presets = {
  getMovePickerConfig: (sourceCanonicalPath, itemsBaseNames) => ({
    headline: "Move to...",
    description: "Select a destination folder:",
    validate: (selection) =>
      validateSelectedItem(
        "move",
        selection,
        sourceCanonicalPath,
        itemsBaseNames,
      ),
  }),
  getCopyPickerConfig: (sourceCanonicalPath, itemsBaseNames) => ({
    headline: "Copy to...",
    description: "Select a destination folder:",
    validate: (selection) =>
      validateSelectedItem(
        "copy",
        selection,
        sourceCanonicalPath,
        itemsBaseNames,
      ),
  }),
} as const satisfies {
  [key: string]: (
    sourceCanonicalPath: string,
    itemsBaseNames: string[],
  ) => DestinationPickerConfig;
};

export const useDestinationPicker = () => {
  const promptDestination = (
    config: DestinationPickerConfig,
  ): Promise<DestinationPickerResult> => {
    if (isActive.value) {
      // fallback in case of simultaneous prompts:
      // resolve the already open one as canceled
      unwrappedPromise.value.resolve(null);
      unwrappedPromise.value = PromiseUtils.createUnwrappedPromise();
    }

    activePickerModalConfig.value = { ...defaults, ...config };
    isActive.value = true;
    return unwrappedPromise.value.promise;
  };

  const close = () => {
    isActive.value = false;
    activePickerModalConfig.value = null;
    unwrappedPromise.value = PromiseUtils.createUnwrappedPromise();
  };

  const confirm = (result: DestinationPickerResult) => {
    unwrappedPromise.value.resolve(result);
    close();
  };

  const cancel = () => {
    unwrappedPromise.value.resolve(null);
    close();
  };

  return {
    promptDestination,
    confirm,
    cancel,
    config: computed(() => activePickerModalConfig.value),
    isActive: computed(() => isActive.value),
    presets,
  };
};
