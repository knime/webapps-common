import {
  type MaybeRef,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  readonly,
  ref,
  unref,
  watch,
} from "vue";
import { every, noop } from "lodash-es";

import type { HintConfiguration, HintState } from "../types";
import { createHint } from "../util/createHint";

import { useHintState } from "./useHintState";

let HINT_CONFIGURATIONS: Record<string, HintConfiguration> = {};

const remoteStorage: {
  getRemoteHintState: () => Promise<HintState>;
  setRemoteHintState: (state: HintState) => Promise<boolean>;
} = {
  getRemoteHintState: () => Promise.resolve({} as HintState),
  setRemoteHintState: () => Promise.resolve(false),
};

export const setHintConfiguration = (
  hints: Record<string, HintConfiguration>,
  remoteStorageFunctions?: typeof remoteStorage,
) => {
  HINT_CONFIGURATIONS = hints;

  remoteStorage.getRemoteHintState =
    remoteStorageFunctions?.getRemoteHintState ??
    remoteStorage.getRemoteHintState;
  remoteStorage.setRemoteHintState =
    remoteStorageFunctions?.setRemoteHintState ??
    remoteStorage.setRemoteHintState;
};

export const useHint = ({
  uniqueUserId,
  skipHints = false,
}: {
  uniqueUserId: MaybeRef<string>;
  skipHints?: MaybeRef<boolean>;
}) => {
  if (unref(skipHints)) {
    const isAllSkipped = ref(true);
    return {
      isCompleted: () => true,
      isAllSkipped: readonly(isAllSkipped),
      createHintComponent: noop,
      getCompleteHintComponentCallback: () => noop,
      completeHintWithoutComponent: () => noop,
    };
  }

  const {
    initialize,
    completeHint,
    completeHintWithoutVisibility,
    isCompleted,
    isAllSkipped,
    setSkipAll,
    currentlyVisibleHint,
    setCurrentlyVisibleHint,
  } = useHintState({ uniqueUserId, ...remoteStorage });

  onBeforeMount(() => {
    initialize();
  });

  const getHintConfiguration = (hintId: string) => {
    return HINT_CONFIGURATIONS[hintId] || null;
  };

  const getHintVisibility = ({
    hintId,
    checkHintVisibilityCondition = () => true,
  }: {
    hintId: string;
    checkHintVisibilityCondition: () => boolean;
  }) => {
    if (isAllSkipped.value) {
      return false;
    }

    if (isCompleted(hintId)) {
      return false;
    }

    if (!document.getElementById(hintId)) {
      return false;
    }

    if (currentlyVisibleHint.value) {
      return currentlyVisibleHint.value === hintId;
    }

    const hintConfiguration = getHintConfiguration(hintId);
    const { dependsOn = [] } = hintConfiguration;

    const allDependencyHintsCompleted = every(
      dependsOn.map((dependencyHint) => isCompleted(dependencyHint)),
    );
    if (!allDependencyHintsCompleted) {
      return false;
    }

    return checkHintVisibilityCondition();
  };

  const completeHintComponentCallbacks: Record<string, () => void> = {};
  const getCompleteHintComponentCallback = (hintId: string) => () => {
    const completeHint = completeHintComponentCallbacks[hintId] || noop;
    completeHint();
  };

  const visibilityUnWatchCallbacks: Array<() => void> = [];
  const destroyHintCallbacks: Array<() => void> = [];
  onBeforeUnmount(() => {
    visibilityUnWatchCallbacks.forEach((callback) => callback());
    destroyHintCallbacks.forEach((callback) => callback());
    setCurrentlyVisibleHint(null);
  });

  const createHintComponent = ({
    hintId,
    checkHintVisibilityCondition = () => true,
  }: {
    hintId: string;
    checkHintVisibilityCondition: () => boolean;
  }) => {
    const hintConfiguration = getHintConfiguration(hintId);

    if (!hintConfiguration) {
      return;
    }

    const {
      title,
      description,
      // eslint-disable-next-line no-undefined
      linkText = undefined,
      // eslint-disable-next-line no-undefined
      linkHref = undefined,
      align = "center",
      side = "bottom",
    } = hintConfiguration;

    let unWatchVisibility = noop;
    const setHintCompleted = () => completeHint(hintId);

    const { showHint, closeHint } = createHint({
      element: `#${hintId}`,
      title,
      description,
      linkText,
      linkHref,
      onCompleteHint: () => {
        unWatchVisibility();
        setHintCompleted();
      },
      onSkipAllHints: setSkipAll,
      align,
      side,
    });

    completeHintComponentCallbacks[hintId] = () => {
      unWatchVisibility();
      setHintCompleted();
      closeHint();
    };

    const isVisible = computed(() =>
      getHintVisibility({ hintId, checkHintVisibilityCondition }),
    );
    unWatchVisibility = watch(
      isVisible,
      (value) => {
        if (value) {
          setCurrentlyVisibleHint(hintId);
          showHint();
          destroyHintCallbacks.unshift(closeHint);
        }
      },
      { immediate: true },
    );
    visibilityUnWatchCallbacks.unshift(unWatchVisibility);
  };

  return {
    isCompleted,
    isAllSkipped: readonly(isAllSkipped),
    createHintComponent,
    getCompleteHintComponentCallback,
    completeHintWithoutComponent: completeHintWithoutVisibility,
  };
};
