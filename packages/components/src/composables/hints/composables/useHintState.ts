import { type MaybeRef, computed, ref, unref, watch } from "vue";
import { type RemovableRef, useLocalStorage } from "@vueuse/core";

import type { HintState } from "../types";
import { logger } from "../util/logger";

const initState = ref<"uninitialized" | "initializing" | "initialized">(
  "uninitialized",
);
const currentlyVisibleHint = ref<string | null>(null);

type Config = {
  storageKey: string;
  uniqueUserId: MaybeRef<string>;
  getRemoteHintState: (storageKey: string) => Promise<HintState>;

  setRemoteHintState: (
    storageKey: string,
    state: HintState,
  ) => Promise<boolean>;
};

let __config: Config;
let __state: RemovableRef<HintState>;

export const getState = () => {
  if (!__config) {
    throw new Error("Hint state accessed before initialization");
  }

  if (__state) {
    return __state;
  }

  __state = useLocalStorage<HintState>(
    __config.storageKey,
    { completedHints: [], skipAll: false },
    { deep: true, listenToStorageChanges: true },
  );

  return __state;
};

export const __resetStateForTests = () => {
  if (import.meta.env.TEST) {
    initState.value = "uninitialized";
    currentlyVisibleHint.value = null;

    if (!__config?.storageKey) {
      return;
    }

    if (__state) {
      __state.value = { completedHints: [], skipAll: false };
    }
  }
};

export const initialize = async (config: Config) => {
  if (initState.value !== "uninitialized") {
    logger().warn("Hint state cannot be initialized more than once");
    return;
  }

  const { storageKey, uniqueUserId } = config;
  const localStorageKey = `${storageKey}.${unref(uniqueUserId)}`;

  __config = { ...config, storageKey: localStorageKey };

  const state = getState();

  logger().info("Initializing hint state");

  try {
    initState.value = "initializing";
    const remoteState = await config.getRemoteHintState(localStorageKey);
    logger().debug("got remote state", remoteState);

    // merge hints from remote
    state.value = {
      skipAll: remoteState.skipAll ?? state.value.skipAll,
      completedHints: [
        ...state.value.completedHints,
        ...(remoteState.completedHints ?? []),
      ],
    };
  } catch (error) {
    logger().error(
      "Getting hints from remote failed; will use default hint state",
      error,
    );
  } finally {
    initState.value = "initialized";
  }

  watch(
    state,
    async (value) => {
      if (initState.value !== "initialized") {
        logger().debug(
          `Tried to update hint state but status is: ${initState.value}`,
        );
        return;
      }

      try {
        await config.setRemoteHintState(localStorageKey, value);
      } catch (_e) {
        logger().error("Updating remote hint state failed");
      }
    },
    { deep: true },
  );
};

/**
 * Composable that manages the internal state of the hints. It expects the state to have been initialized
 * first. See exported `initialize` function
 * @returns set of utilities to manage the internal state
 */
export const useHintState = () => {
  const isAllHintsSkipped = computed(() => {
    try {
      const state = getState();
      return state.value.skipAll;
    } catch {
      return false;
    }
  });

  const setCurrentlyVisibleHint = (hintId: string | null) => {
    currentlyVisibleHint.value = hintId;
  };

  const isCompleted = (hintId: string) => {
    try {
      const hintState = getState();
      return hintState.value.completedHints.includes(hintId) || false;
    } catch (error) {
      logger().error("Failed to check for hint completion status.", {
        hintId,
        error,
      });

      return false;
    }
  };

  const completeHint = (hintId: string) => {
    if (initState.value !== "initialized") {
      logger().debug(
        `Tried to complete hint "${hintId}" but state is not initialized; aborting`,
      );
      return;
    }

    if (isCompleted(hintId) || isAllHintsSkipped.value) {
      logger().debug(
        `Tried to complete hint "${hintId}" but hint is already completed or hints are skipped; aborting`,
      );
      return;
    }

    if (currentlyVisibleHint.value !== hintId) {
      logger().debug(
        `Tried to complete hint "${hintId}" but it's not visible; aborting`,
      );
      return;
    }

    logger().debug(`Completing hint "${hintId}"`);
    getState().value.completedHints.unshift(hintId);

    currentlyVisibleHint.value = null;
  };

  const completeHintWithoutVisibility = (hintId: string) => {
    if (initState.value !== "initialized") {
      logger().debug(
        "Tried to completeHintWithoutVisibility but state is not initialized; aborting",
      );
      return;
    }

    if (isCompleted(hintId)) {
      return;
    }

    getState().value.completedHints.unshift(hintId);
  };

  const setSkipAll = () => {
    if (initState.value !== "initialized") {
      logger().debug(
        "Tried to skipAll hints but state is not initialized; aborting",
      );
      return;
    }

    getState().value.skipAll = true;
    currentlyVisibleHint.value = null;
  };

  return {
    isInitialized: computed(() => initState.value === "initialized"),
    completeHint,
    completeHintWithoutVisibility,
    isCompleted,
    isAllSkipped: isAllHintsSkipped,
    setSkipAll,
    currentlyVisibleHint,
    setCurrentlyVisibleHint,
  };
};
