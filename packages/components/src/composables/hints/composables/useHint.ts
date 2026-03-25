import {
  type MaybeRef,
  type Ref,
  type WatchStopHandle,
  computed,
  onBeforeUnmount,
  readonly,
  ref,
  unref,
  watch,
} from "vue";

import type { HintConfiguration, HintState, MaybeElement } from "../types";
import { logger } from "../util/logger";

import { useHintProvider } from "./useHintProvider";
import { initialize, useHintState } from "./useHintState";

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

  if (unref(skipHints)) {
    return;
  }

  initialize({
    getRemoteHintState,
    setRemoteHintState,
    storageKey,
    uniqueUserId,
  }).catch((err) => {
    logger().error("Initialization failure", err);
  });
};

export const useHint = ({ hintSetupId = "default" } = {}) => {
  const { hints, skipHints } = hintSetup[hintSetupId];

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
    isInitialized,
    completeHint,
    completeHintWithoutVisibility,
    isCompleted,
    isAllSkipped,
    setSkipAll,
    currentlyVisibleHint,
    setCurrentlyVisibleHint,
  } = useHintState();

  const { createHintData } = useHintProvider();

  const getHintConfiguration = (hintId: string) => {
    return hints[hintId] || null;
  };

  const checkHintVisibilityConstraints = (hintId: string) => {
    if (isAllSkipped.value || !isInitialized.value) {
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

    return allDependencyHintsCompleted;
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
    onShow,
    onDismiss,
  }: {
    hintId: string;
    /** custom selector - takes precedence over the configured one */
    referenceSelector?: string;
    /** element reference - if given this is used over any selector */
    referenceElement?: Ref<MaybeElement>;
    isVisibleCondition?: Ref<boolean>;
    /**
     * Callback triggered when the hint is first displayed
     */
    onShow?: (hintId: string) => void;
    /**
     * Callback triggered when the hint is dismissed by the user
     */
    onDismiss?: (hintId: string) => void;
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
        onDismiss?.(hintId);
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

    const isVisible = computed(() => {
      return checkHintVisibilityConstraints(hintId) && isVisibleCondition.value;
    });

    unWatchVisibility = watch(
      isVisible,
      (value) => {
        logger().debug("Updating visibility for hint", {
          hintId,
          visible: value,
        });

        if (value) {
          setCurrentlyVisibleHint(hintId);
          showHint(hintId);
          onShow?.(hintId);
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
