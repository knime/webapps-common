import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import { flushPromises } from "@vue/test-utils";

import type { HintConfiguration } from "../../types";
import { setupHints, useHint } from "../useHint";
import * as useHintState from "../useHintState";

import mountComposable from "./mountComposable";

const { showHintMock, closeHintMock, createHintDataMock } = vi.hoisted(() => ({
  showHintMock: vi.fn(),
  closeHintMock: vi.fn(),
  createHintDataMock: vi.fn(),
}));

vi.mock("../../composables/useHintProvider", () => {
  return {
    useHintProvider: vi.fn().mockReturnValue({
      createHintData: createHintDataMock.mockReturnValue({
        showHint: showHintMock,
        closeHint: closeHintMock,
      }),
    }),
  };
});

describe("useHint", () => {
  const hintConfigurationsMock: Record<string, HintConfiguration> = {};

  type Opts = Partial<Parameters<typeof setupHints>[0]> & {};

  const doMount = (options: Opts = {}) => {
    setupHints({
      ...options,
    });

    const { getComposableResult, lifeCycle } = mountComposable({
      composable: useHint,
      composableProps: undefined,
    });

    const useHintResult = getComposableResult() as ReturnType<typeof useHint>;

    return { useHintResult, lifeCycle };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    Object.keys(hintConfigurationsMock).forEach((key) => {
      delete hintConfigurationsMock[key];
    });
    useHintState.__resetStateForTests();
  });

  describe("setup", () => {
    it("initializes state state", () => {
      const initializeSpy = vi.spyOn(useHintState, "initialize");

      const getRemoteHintState = vi.fn();
      const setRemoteHintState = vi.fn();

      doMount({
        storageKey: "the-storage-key",
        uniqueUserId: "the-unique-user",
        getRemoteHintState,
        setRemoteHintState,
      });

      expect(initializeSpy).toHaveBeenCalledWith({
        storageKey: "the-storage-key",
        uniqueUserId: "the-unique-user",
        getRemoteHintState,
        setRemoteHintState,
      });
    });

    it("does not initialize any state when skipHints is true", () => {
      const initializeSpy = vi.spyOn(useHintState, "initialize");

      setupHints({
        skipHints: true,
        hints: {
          someHint: {
            title: "my hint",
            description: "this is a hint",
            align: "center",
            side: "bottom",
            dependsOn: [],
          },
        },
      });

      expect(initializeSpy).not.toHaveBeenCalled();
    });
  });

  describe("useHint", () => {
    it("creates a hint", async () => {
      const hintKey = "____HINT_1___";
      const hintConfig: HintConfiguration = {
        title: "my hint",
        description: "this is a hint",
        linkText: "some link",
        linkHref: "/path/to/resource",
        align: "center",
        side: "bottom",
        dependsOn: [],
      };

      const { useHintResult, lifeCycle } = doMount({
        hints: {
          [hintKey]: hintConfig,
        },
      });

      await flushPromises();

      useHintResult.createHint({
        hintId: hintKey,
        isVisibleCondition: ref(true),
      });

      expect(createHintDataMock).toHaveBeenCalledWith(
        hintKey,
        expect.objectContaining({
          title: "my hint",
          description: "this is a hint",
          linkText: "some link",
          linkHref: "/path/to/resource",
          align: "center",
          side: "bottom",
        }),
      );
      lifeCycle.unmount();
    });

    it("can check whether a hint is completed", async () => {
      const { useHintResult, lifeCycle } = doMount({
        getRemoteHintState: vi.fn().mockResolvedValue({
          completedHints: ["bar"],
          skipAll: false,
        }),
      });

      await flushPromises();

      expect(useHintResult.isCompleted("bar")).toBe(true);
      expect(useHintResult.isCompleted("myHint")).toBe(false);

      lifeCycle.unmount();
    });

    it("can complete hint without a component", async () => {
      const { useHintResult } = doMount();

      await flushPromises();

      expect(useHintResult.isCompleted("myHint")).toBe(false);
      useHintResult.completeHintWithoutComponent("myHint");

      await nextTick();
      expect(useHintResult.isCompleted("myHint")).toBe(true);
    });

    it("created hint handles onShow callback", async () => {
      const hintKey = "____HINT_2___";
      const hintConfig: HintConfiguration = {
        title: "my hint",
        description: "this is a hint",
        linkText: "some link",
        linkHref: "/path/to/resource",
        align: "center",
        side: "bottom",
        dependsOn: [],
      };

      const { useHintResult, lifeCycle } = doMount({
        hints: {
          [hintKey]: hintConfig,
        },
      });

      await flushPromises();

      const visibility = ref(false);
      const onShow = vi.fn();
      useHintResult.createHint({
        hintId: hintKey,
        isVisibleCondition: visibility,
        onShow,
      });

      expect(onShow).not.toHaveBeenCalled();

      visibility.value = true;
      await nextTick();
      expect(onShow).toHaveBeenCalledWith(hintKey);
      lifeCycle.unmount();
    });

    it("created hint handles onDismiss callback", async () => {
      const hintKey = "____HINT_2___";
      const hintConfig: HintConfiguration = {
        title: "my hint",
        description: "this is a hint",
        linkText: "some link",
        linkHref: "/path/to/resource",
        align: "center",
        side: "bottom",
        dependsOn: [],
      };

      const { useHintResult, lifeCycle } = doMount({
        hints: {
          [hintKey]: hintConfig,
        },
      });

      await flushPromises();

      const visibility = ref(true);
      const onDismiss = vi.fn();
      useHintResult.createHint({
        hintId: hintKey,
        isVisibleCondition: visibility,
        onDismiss,
      });

      expect(onDismiss).not.toHaveBeenCalled();

      // trigger hint completion as if it was coming from the popover component
      createHintDataMock.mock.calls[0][1].onCompleteHint();

      await nextTick();

      expect(onDismiss).toHaveBeenCalledWith(hintKey);
      lifeCycle.unmount();
    });
  });

  it("createHint does not create hint if no config available", () => {
    const hintKey = "unknwonHint";
    const { useHintResult } = doMount({
      hints: {},
    });

    useHintResult.createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(createHintDataMock).not.toHaveBeenCalled();
  });

  it("created hint is not shown when the dependent hints are not completed", async () => {
    const dependencyHint = "otherHint";
    const secondDependencyHint = "secondOtherHint";
    const hintKey = "myHint";
    const hintConfig: HintConfiguration = {
      dependsOn: [dependencyHint, secondDependencyHint],
      title: "",
      description: "",
    };

    const { useHintResult, lifeCycle } = doMount({
      hints: {
        [dependencyHint]: {
          title: "",
          description: "",
          dependsOn: [],
        },
        [hintKey]: hintConfig,
      },
      getRemoteHintState: vi.fn().mockResolvedValue({
        completedHints: [secondDependencyHint],
        skipAll: false,
      }),
    });

    useHintResult.createHint({
      hintId: dependencyHint,
      isVisibleCondition: ref(true),
    });

    await flushPromises();

    const visible = ref(false);
    const onShow = vi.fn();
    useHintResult.createHint({
      hintId: hintKey,
      isVisibleCondition: visible,
      onShow,
    });

    expect(onShow).not.toHaveBeenCalled();

    // change 2nd hint's visibilit -> still not shown
    visible.value = true;
    await nextTick();
    expect(onShow).not.toHaveBeenCalled();

    // trigger 1st hint's completion, which now resolves the dependency of the 2nd hint
    createHintDataMock.mock.calls[0][1].onCompleteHint();

    await nextTick();
    expect(onShow).toHaveBeenCalled();

    lifeCycle.unmount();
  });
});
