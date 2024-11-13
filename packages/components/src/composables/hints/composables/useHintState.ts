import { type MaybeRef, computed, readonly, ref, unref, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";

import type { HintState } from "../types";

const initializing = ref(false);
export const initialized = ref(false);
export const currentlyVisibleHint = ref<string | null>(null);

type UseHintStateOptions = {
  storageKey: string;
  uniqueUserId: MaybeRef<string>;
  getRemoteHintState: (storageKey: string) => Promise<HintState>;
  setRemoteHintState: (
    storageKey: string,
    state: HintState,
  ) => Promise<boolean>;
};

export const useHintState = ({
  storageKey,
  uniqueUserId,
  getRemoteHintState,
  setRemoteHintState,
}: UseHintStateOptions) => {
  const localStorageKey = `${storageKey}.${unref(uniqueUserId)}`;

  const hintState = useLocalStorage<HintState>(
    localStorageKey,
    {
      completedHints: [],
      skipAll: false,
    },
    {
      deep: true,
      listenToStorageChanges: true,
    },
  );

  const isAllHintsSkipped = computed(() => hintState.value.skipAll);

  const updateHintState = async (hintState: HintState) => {
    try {
      await setRemoteHintState(storageKey, hintState);
    } catch (e) {
      consola.error("Updating remote hint state failed");
    }
  };

  const getHintState = async () => {
    try {
      const remoteState = await getRemoteHintState(storageKey);

      // merge hints from remote
      hintState.value = {
        skipAll: remoteState.skipAll ?? hintState.value.skipAll,
        completedHints: [
          ...hintState.value.completedHints,
          ...(remoteState.completedHints ?? []),
        ],
      };
    } catch (e) {
      consola.error("Getting hints from remote failed", e);
    }
  };

  watch(
    hintState,
    (value) => {
      if (!initialized.value || initializing.value) {
        return;
      }

      updateHintState(value);
    },
    { deep: true },
  );

  const setCurrentlyVisibleHint = (hintId: string | null) => {
    currentlyVisibleHint.value = hintId;
  };

  const isCompleted = (hintId: string) =>
    hintState.value.completedHints.includes(hintId) || false;
  const completeHint = (hintId: string) => {
    if (!initialized.value) {
      return;
    }
    if (isCompleted(hintId) || isAllHintsSkipped.value) {
      return;
    }
    if (currentlyVisibleHint.value !== hintId) {
      return;
    }

    hintState.value.completedHints.unshift(hintId);
    currentlyVisibleHint.value = null;
  };

  const completeHintWithoutVisibility = (hintId: string) => {
    if (!initialized.value) {
      return;
    }
    if (isCompleted(hintId)) {
      return;
    }
    hintState.value.completedHints.unshift(hintId);
  };

  const setSkipAll = () => {
    hintState.value.skipAll = true;
    currentlyVisibleHint.value = null;
  };

  const initialize = async () => {
    if (isAllHintsSkipped.value || initialized.value || initializing.value) {
      return;
    }
    initializing.value = true;
    await getHintState();
    initialized.value = true;
    initializing.value = false;
  };

  return {
    initialize,
    isInitialized: readonly(initialized),
    completeHint,
    completeHintWithoutVisibility,
    isCompleted,
    isAllSkipped: isAllHintsSkipped,
    setSkipAll,
    currentlyVisibleHint,
    setCurrentlyVisibleHint,
  };
};
