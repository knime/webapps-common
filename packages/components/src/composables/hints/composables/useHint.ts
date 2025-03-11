/* eslint-disable no-undefined */
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

type UseHintSetupOptions = {
  /** the hints */
  hints: Record<string, HintConfiguration>;
  /** key for this hint instance */
  storageKey: string;
  /** user ID used as identifier for the local storage */
  uniqueUserId: MaybeRef<string>;
  /** skip all hints (if there is no session for example) */
  skipHints: MaybeRef<boolean>;
  /** callback function to retrieve remote hint states */
  getRemoteHintState: (storageKey: string) => Promise<HintState>;
  /** callback function to set remote hint states */
  setRemoteHintState: (
    storageKey: string,
    state: HintState,
  ) => Promise<boolean>;
};

const noop = () => undefined;

const hintSetup: Record<string, UseHintSetupOptions> = {};

export const setupHints = (
  {
    hints = {},
    uniqueUserId = "user",
    storageKey = "onboarding.hints",
    skipHints = false,
    getRemoteHintState = () => Promise.resolve({} as HintState),
    setRemoteHintState = () => Promise.resolve(false),
  }: Partial<UseHintSetupOptions>,
  hintSetupId: string = "default",
) => {
  hintSetup[hintSetupId] = {
    hints,
    uniqueUserId,
    storageKey,
    skipHints,
    getRemoteHintState,
    setRemoteHintState,
  };
};

export const useHint = ({ hintSetupId = "default" } = {}) => {
  const {
    hints,
    uniqueUserId,
    storageKey,
    skipHints,
    getRemoteHintState,
    setRemoteHintState,
  } = hintSetup[hintSetupId];

  if (unref(skipHints)) {
    return {
      isCompleted: () => true,
      isAllSkipped: readonly(ref(true)),
      createHint: noop,
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

  const { createHintData } = useHintProvider();

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
      linkText = undefined,
      linkHref = undefined,
      video = [],
      image = undefined,
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

    const { showHint, closeHint } = createHintData(hintId, {
      element,
      title,
      description,
      linkText,
      linkHref,
      video,
      image,
      hideButtons,
      onCompleteHint: () => {
        unWatchVisibility();
        setHintCompleted();
        closeHint(hintId);
      },
      onSkipAllHints: () => {
        setSkipAll();
        closeHint(hintId);
      },
      align,
      side,
    });

    completeHintComponentCallbacks[hintId] = () => {
      unWatchVisibility();
      setHintCompleted();
      closeHint(hintId);
    };

    const isVisible = computed(
      () => checkHintVisibilityConstraints(hintId) && isVisibleCondition.value,
    );
    unWatchVisibility = watch(
      isVisible,
      (value) => {
        if (value) {
          setCurrentlyVisibleHint(hintId);
          showHint(hintId);
          destroyHintCallbacks.unshift(() => closeHint(hintId));
        }
      },
      { immediate: true },
    );
    visibilityUnWatchCallbacks.unshift(unWatchVisibility);
  };

  return {
    isCompleted,
    isAllSkipped: readonly(isAllSkipped),
    createHint: createHintComponent,
    // TODO: do we need this otherwise improve API (createHint could return functions...)
    getCompleteHintComponentCallback,
    completeHintWithoutComponent: completeHintWithoutVisibility,
  };
};
