import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import { useLocalStorage } from "@vueuse/core";

import {
  currentlyVisibleHint,
  initialized,
  useHintState,
} from "../useHintState";

import mountComposable from "./mountComposable";

vi.mock("@vueuse/core", async () => {
  const actual = await vi.importActual("@vueuse/core");
  return {
    ...actual,
    useLocalStorage: vi.fn(),
  };
});

describe("useHintState", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    initialized.value = false;
    currentlyVisibleHint.value = null;
  });

  const doMount = ({
    isAllSkipped = false,
    isAlreadyInitialized = false,
    completedHints = [],
    currentlyVisible = null,
  }: {
    isAllSkipped?: boolean;
    isAlreadyInitialized?: boolean;
    isHintCompleted?: boolean;
    completedHints?: string[];
    currentlyVisible?: string | null;
  } = {}) => {
    if (isAlreadyInitialized) {
      initialized.value = true;
    }
    if (currentlyVisibleHint) {
      currentlyVisibleHint.value = currentlyVisible;
    }

    const state = ref({
      completedHints,
      skipAll: isAllSkipped,
    });

    const getRemoteHintStateMock = vi.fn().mockResolvedValue({});
    const setRemoteHintStateMock = vi.fn();

    // @ts-expect-error Property 'mockReturnValue' does not exist on type
    useLocalStorage.mockReturnValue(state);

    const { getComposableResult } = mountComposable({
      composable: useHintState,
      composableProps: {
        storageKey: "onboarding.hints",
        uniqueUserId: "",
        getRemoteHintState: getRemoteHintStateMock,
        setRemoteHintState: setRemoteHintStateMock,
      },
    });

    return {
      getComposableResult,
      state,
      getRemoteHintStateMock,
      setRemoteHintStateMock,
    };
  };

  it("initializes state", async () => {
    const { getComposableResult, getRemoteHintStateMock } = doMount({
      isAlreadyInitialized: false,
      isAllSkipped: false,
    });
    const { initialize, isInitialized } = getComposableResult();

    await initialize();

    expect(getRemoteHintStateMock).toHaveBeenCalled();
    expect(isInitialized.value).toBe(true);
  });

  it("merges completedHints from remote state", async () => {
    const { getComposableResult, getRemoteHintStateMock } = doMount({
      isAlreadyInitialized: false,
      isAllSkipped: false,
      completedHints: ["something"],
    });

    getRemoteHintStateMock.mockResolvedValue({
      skipAll: true,
      completedHints: ["another", "more"],
    });
    const { initialize, isInitialized, isCompleted, isAllSkipped } =
      getComposableResult();

    await initialize();

    expect(getRemoteHintStateMock).toHaveBeenCalled();
    expect(isInitialized.value).toBe(true);
    expect(isCompleted("something")).toBe(true);
    expect(isCompleted("another")).toBe(true);
    expect(isCompleted("more")).toBe(true);
    expect(isAllSkipped.value).toBe(true);
  });

  it("does not initialize state when already initialized", async () => {
    const { getComposableResult, getRemoteHintStateMock } = doMount({
      isAlreadyInitialized: true,
      isAllSkipped: false,
    });
    const { initialize } = getComposableResult();

    await initialize();

    expect(getRemoteHintStateMock).not.toHaveBeenCalled();
  });

  it("does not initialize store when skip all hints is true", async () => {
    const { getComposableResult, getRemoteHintStateMock } = doMount({
      isAlreadyInitialized: false,
      isAllSkipped: true,
    });
    const { initialize, isInitialized } = getComposableResult();

    await initialize();

    expect(getRemoteHintStateMock).not.toHaveBeenCalled();
    expect(isInitialized.value).toBe(false);
  });

  it("can complete hint", async () => {
    const hintKey = "myHint";
    const { getComposableResult, state, setRemoteHintStateMock } = doMount({
      isAllSkipped: false,
      isAlreadyInitialized: true,
      currentlyVisible: hintKey,
      completedHints: [],
    });
    const { completeHint } = getComposableResult();

    completeHint(hintKey);
    await nextTick();

    expect(state.value.completedHints).toContain(hintKey);
    expect(setRemoteHintStateMock).toHaveBeenCalledWith(
      "onboarding.hints",
      state.value,
    );
  });

  it("does not complete hint when already completed", () => {
    const hintKey = "myHint";
    const { getComposableResult, state } = doMount({
      completedHints: [hintKey],
    });
    const { completeHint } = getComposableResult();

    completeHint(hintKey);

    expect(state.value.completedHints).toStrictEqual([hintKey]);
  });

  it("can skip all hints", async () => {
    const { getComposableResult, setRemoteHintStateMock, state } = doMount({
      isAlreadyInitialized: true,
      isAllSkipped: false,
    });
    const { setSkipAll, isAllSkipped } = getComposableResult();

    setSkipAll();

    expect(isAllSkipped.value).toBe(true);
    await nextTick();
    expect(setRemoteHintStateMock).toHaveBeenCalledWith(
      "onboarding.hints",
      state.value,
    );
  });

  it("can set currently visible hint", () => {
    const hintKey = "myHint";
    const { getComposableResult } = doMount();
    const { setCurrentlyVisibleHint, currentlyVisibleHint } =
      getComposableResult();

    setCurrentlyVisibleHint(hintKey);

    expect(currentlyVisibleHint.value).toEqual(hintKey);
  });

  it.todo("tests for completeHintWithoutVisibility");
});
