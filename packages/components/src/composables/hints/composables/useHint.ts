import {
  type MaybeRef,
  type Ref,
  type WatchStopHandle,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  readonly,
  ref,
  unref,
  watch,
} from "vue";

import type { HintConfiguration, HintState, MaybeElement } from "../types";

import { useHintProvider } from "./useHintProvider";
import { useHintState } from "./useHintState";

type UseHintOptions = {
  /** the hints */
  hints: Record<string, HintConfiguration>;
  /** key for this hint instance */
  storageKey?: string;
  /** user ID used as identifier for the local storage */
  uniqueUserId?: MaybeRef<string>;
  /** skip all hints (if there is no session for example) */
  skipHints?: MaybeRef<boolean>;
  /** callback function to retrieve remote hint states */
  getRemoteHintState?: (storageKey: string) => Promise<HintState>;
  /** callback function to set remote hint states */
  setRemoteHintState?: (
    storageKey: string,
    state: HintState,
  ) => Promise<boolean>;
};

// eslint-disable-next-line no-undefined
const noop = () => undefined;

const { createHint } = useHintProvider();

export const useHint = ({
  hints,
  uniqueUserId = "user",
  storageKey = "onboarding.hints",
  skipHints = false,
  getRemoteHintState = () => Promise.resolve({} as HintState),
  setRemoteHintState = () => Promise.resolve(false),
}: UseHintOptions) => {
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
  } = useHintState({
    uniqueUserId,
    getRemoteHintState,
    setRemoteHintState,
    storageKey,
  });

  onBeforeMount(() => {
    initialize();
  });

  const getHintConfiguration = (hintId: string) => {
    return hints[hintId] || null;
  };

  const checkHintVisibilityConstraints = (hintId: string) => {
    if (isAllSkipped.value) {
      return false;
    }

    if (isCompleted(hintId)) {
      return false;
    }

    if (currentlyVisibleHint.value) {
      return currentlyVisibleHint.value === hintId;
    }

    const hintConfiguration = getHintConfiguration(hintId);
    const { dependsOn = [] } = hintConfiguration;

    const allDependencyHintsCompleted = dependsOn.every((dependencyHint) =>
      isCompleted(dependencyHint),
    );
    if (!allDependencyHintsCompleted) {
      return false;
    }

    return true;
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
    referenceSelector,
    referenceElement,
    isVisibleCondition = ref(true),
  }: {
    hintId: string;
    /** custom selector - takes precedence over the configured one */
    referenceSelector?: string;
    /** element reference - if given this is used over any selector */
    referenceElement?: Ref<MaybeElement>;
    isVisibleCondition?: Ref<boolean>;
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
      video = [],
      // eslint-disable-next-line no-undefined
      referenceSelector: configuredSelector = undefined,
      hideButtons = false,
      align = "center",
      side = "bottom",
    } = hintConfiguration;

    let unWatchVisibility: WatchStopHandle = noop;
    const setHintCompleted = () => completeHint(hintId);

    const element =
      unref(referenceElement) ??
      referenceSelector ??
      configuredSelector ??
      `#${hintId}`;

    const { showHint, closeHint } = createHint({
      element,
      title,
      description,
      linkText,
      linkHref,
      video,
      hideButtons,
      onCompleteHint: () => {
        unWatchVisibility();
        setHintCompleted();
        closeHint();
      },
      onSkipAllHints: () => {
        setSkipAll();
        closeHint();
      },
      align,
      side,
    });

    completeHintComponentCallbacks[hintId] = () => {
      unWatchVisibility();
      setHintCompleted();
      closeHint();
    };

    const isVisible = computed(
      () => checkHintVisibilityConstraints(hintId) && isVisibleCondition.value,
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
