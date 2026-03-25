import { afterEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { flushPromises } from "@vue/test-utils";
import { useLocalStorage } from "@vueuse/core";

import {
  __resetStateForTests,
  initialize,
  useHintState,
} from "../useHintState";

vi.mock("@vueuse/core", async () => {
  const actual = await vi.importActual("@vueuse/core");
  return {
    ...actual,
    useLocalStorage: vi.fn(),
  };
});

describe("useHintState", () => {
  afterEach(() => {
    vi.resetAllMocks();
    __resetStateForTests();
  });

  const mockLocalState = (state: {
    completedHints: string[];
    skipAll: boolean;
  }) => {
    (useLocalStorage as any).mockReturnValue(ref(state));
  };

  describe("initialization", () => {
    it("initializes", async () => {
      const setRemoteHintState = vi.fn();
      const getRemoteHintState = vi.fn();
      const { isInitialized } = useHintState();

      expect(isInitialized.value).toBe(false);
      await initialize({
        storageKey: "my-key",
        uniqueUserId: "my-user",
        setRemoteHintState,
        getRemoteHintState,
      });

      expect(isInitialized.value).toBe(true);
    });

    it("does not initialize state when already initialized", async () => {
      const setRemoteHintState = vi.fn();
      const getRemoteHintState = vi.fn();

      await initialize({
        storageKey: "my-key",
        uniqueUserId: "my-user",
        setRemoteHintState,
        getRemoteHintState,
      });

      await initialize({
        storageKey: "my-key",
        uniqueUserId: "my-user",
        setRemoteHintState,
        getRemoteHintState,
      });

      expect(getRemoteHintState).toHaveBeenCalledOnce();
    });
  });

  it("merges completedHints from remote state", async () => {
    mockLocalState({
      completedHints: ["something"],
      skipAll: false,
    });

    const setRemoteHintState = vi.fn();
    const getRemoteHintState = vi.fn().mockResolvedValue({
      skipAll: true,
      completedHints: ["another", "more"],
    });

    await initialize({
      storageKey: "my-key",
      uniqueUserId: "my-user",
      setRemoteHintState,
      getRemoteHintState,
    });

    const { isCompleted, isAllSkipped } = useHintState();

    expect(getRemoteHintState).toHaveBeenCalled();
    expect(isCompleted("something")).toBe(true);
    expect(isCompleted("another")).toBe(true);
    expect(isCompleted("more")).toBe(true);
    expect(isAllSkipped.value).toBe(true);
  });

  it("can complete hint", async () => {
    const hintKey = "myHint";
    mockLocalState({
      completedHints: [],
      skipAll: false,
    });

    const setRemoteHintState = vi.fn();
    const getRemoteHintState = vi.fn().mockResolvedValue({
      skipAll: false,
      completedHints: [],
    });

    await initialize({
      storageKey: "my-key",
      uniqueUserId: "my-user",
      setRemoteHintState,
      getRemoteHintState,
    });

    const { isCompleted, completeHint, setCurrentlyVisibleHint } =
      useHintState();
    setCurrentlyVisibleHint(hintKey);

    expect(isCompleted(hintKey)).toBe(false);

    completeHint(hintKey);
    await flushPromises();
    expect(isCompleted(hintKey)).toBe(true);

    expect(setRemoteHintState).toHaveBeenCalledWith("my-key.my-user", {
      completedHints: ["myHint"],
      skipAll: false,
    });
  });

  it("does not complete hint when already completed", async () => {
    const hintKey = "myHint";
    mockLocalState({
      completedHints: [],
      skipAll: false,
    });

    const setRemoteHintState = vi.fn();
    const getRemoteHintState = vi.fn().mockResolvedValue({
      skipAll: false,
      completedHints: [],
    });

    await initialize({
      storageKey: "my-key",
      uniqueUserId: "my-user",
      setRemoteHintState,
      getRemoteHintState,
    });

    const { completeHint, setCurrentlyVisibleHint } = useHintState();
    setCurrentlyVisibleHint(hintKey);

    completeHint(hintKey);
    completeHint(hintKey);
    completeHint(hintKey);
    await flushPromises();

    expect(setRemoteHintState).toHaveBeenCalledExactlyOnceWith(
      "my-key.my-user",
      {
        completedHints: ["myHint"],
        skipAll: false,
      },
    );
  });

  it("can skip all hints", async () => {
    mockLocalState({
      completedHints: [],
      skipAll: false,
    });

    const setRemoteHintState = vi.fn();
    const getRemoteHintState = vi.fn().mockResolvedValue({
      skipAll: false,
      completedHints: [],
    });

    await initialize({
      storageKey: "my-key",
      uniqueUserId: "my-user",
      setRemoteHintState,
      getRemoteHintState,
    });

    const { setSkipAll } = useHintState();

    setSkipAll();
    await flushPromises();
    expect(setRemoteHintState).toHaveBeenCalledExactlyOnceWith(
      "my-key.my-user",
      expect.objectContaining({
        skipAll: true,
      }),
    );
  });

  it("can complete without visibility", async () => {
    mockLocalState({
      completedHints: [],
      skipAll: false,
    });

    const setRemoteHintState = vi.fn();
    const getRemoteHintState = vi.fn().mockResolvedValue({
      skipAll: false,
      completedHints: [],
    });

    await initialize({
      storageKey: "my-key",
      uniqueUserId: "my-user",
      setRemoteHintState,
      getRemoteHintState,
    });

    const { isCompleted, completeHintWithoutVisibility, currentlyVisibleHint } =
      useHintState();

    expect(currentlyVisibleHint.value).toBeNull();

    completeHintWithoutVisibility("foo");

    await flushPromises();
    expect(isCompleted("foo")).toBe(true);

    expect(setRemoteHintState).toHaveBeenCalledWith("my-key.my-user", {
      completedHints: ["foo"],
      skipAll: false,
    });
  });
});
