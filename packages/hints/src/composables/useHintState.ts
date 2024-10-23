import { type MaybeRef, computed, readonly, ref, unref, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { isEqual, merge } from "lodash-es";

import type { HintState } from "../types";

export const HINTS_STORAGE_KEY = "onboarding.hints";

const initializing = ref(false);
export const initialized = ref(false);
export const currentlyVisibleHint = ref<string | null>(null);

export const useHintState = ({
  uniqueUserId,
  getRemoteHintState,
  setRemoteHintState,
}: {
  uniqueUserId: MaybeRef<string>;
  getRemoteHintState: () => Promise<HintState>;
  setRemoteHintState: (state: HintState) => Promise<boolean>;
}) => {
  const localStorageKey = `${HINTS_STORAGE_KEY}.${unref(uniqueUserId)}`;

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
      await setRemoteHintState(hintState);
    } catch (e) {
      consola.error("Updating remote hint state failed");
    }
  };

  const getHintState = async () => {
    try {
      const stateFromBackend = await getRemoteHintState();

      hintState.value = merge({}, hintState.value, stateFromBackend);
    } catch (e) {
      consola.error("Getting hints from remote failed", e);
    }
  };

  watch(hintState, (value, oldValue) => {
    if (!initialized.value || initializing.value) {
      return Promise.resolve();
    }

    if (isEqual(value, oldValue)) {
      return Promise.resolve();
    }

    return updateHintState(value);
  });

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
