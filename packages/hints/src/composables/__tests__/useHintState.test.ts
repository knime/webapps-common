import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
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

// eslint-disable-next-line vitest/no-disabled-tests
describe.skip("useHintState", () => {
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

    useLocalStorage.mockReturnValue(state);

    const { getComposableResult } = mountComposable({
      composable: useHintState,
      composableProps: {},
    });

    return {
      getComposableResult,
      state,
    };
  };

  it("initializes state", async () => {
    const { getComposableResult, getPropertyMock } = doMount({
      isAlreadyInitialized: false,
      isAllSkipped: false,
    });
    const { initialize, isInitialized } = getComposableResult();

    await initialize();

    expect(getPropertyMock).toHaveBeenCalled();
    expect(isInitialized).toBe(true);
  });

  it("does not initialize state when already initialized", async () => {
    const { getComposableResult, getPropertyMock } = doMount({
      isAlreadyInitialized: true,
      isAllSkipped: false,
    });
    const { initialize } = getComposableResult();

    await initialize();

    expect(getPropertyMock).not.toHaveBeenCalled();
  });

  it("does not initialize store when skip all hints is true", async () => {
    const { getComposableResult, getPropertyMock } = doMount({
      isAlreadyInitialized: false,
      isAllSkipped: true,
    });
    const { initialize, isInitialized } = getComposableResult();

    await initialize();

    expect(getPropertyMock).not.toHaveBeenCalled();
    expect(isInitialized).toBe(false);
  });

  it("can complete hint", () => {
    const hintKey = "myHint";
    const { getComposableResult, state, editPropertyMock } = doMount({
      completedHints: [],
    });
    const { completeHint } = getComposableResult();

    completeHint(hintKey);

    expect(state.value.completedHints).toContain(hintKey);
    expect(editPropertyMock).toHaveBeenCalledWith(state.value);
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

  it("can skip all hints", () => {
    const { getComposableResult, editPropertyMock, state } = doMount();
    const { setSkipAll, isAllSkipped } = getComposableResult();

    setSkipAll();

    expect(isAllSkipped).toBe(true);
    expect(editPropertyMock).toHaveBeenCalledWith(state.value);
  });

  it("can set currently visible hint", () => {
    const hintKey = "myHint";
    const { getComposableResult } = doMount({
      isHintCompleted: false,
    });
    const { setCurrentlyVisibleHint, currentlyVisibleHint } =
      getComposableResult();

    setCurrentlyVisibleHint(hintKey);

    expect(currentlyVisibleHint).toEqual(hintKey);
  });

  it.todo("tests for completeHintWithoutVisibility");

  it.todo("update backend on 404");
});
