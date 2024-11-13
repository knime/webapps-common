import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { HintConfiguration } from "../../types";
import { setupHints, useHint } from "../useHint";
import * as useHintProvider from "../useHintProvider";
import * as useHintState from "../useHintState";

import mountComposable from "./mountComposable";

vi.mock("../useHintState", () => {
  const initializeMock = vi.fn().mockResolvedValue({});
  const completeHintMock = vi.fn();
  const completeHintWithoutVisibilityMock = vi.fn();
  const isCompletedMock = vi.fn();
  const isAllSkippedMock = { value: false };
  const setSkipAllMock = vi.fn();
  const currentlyVisibleHintMock = { value: null };
  const setCurrentlyVisibleHintMock = vi.fn();
  const useHintState = vi.fn().mockReturnValue({
    initialize: initializeMock,
    completeHint: completeHintMock,
    completeHintWithoutVisibility: completeHintWithoutVisibilityMock,
    isCompleted: isCompletedMock,
    isAllSkipped: isAllSkippedMock,
    setSkipAll: setSkipAllMock,
    currentlyVisibleHint: currentlyVisibleHintMock,
    setCurrentlyVisibleHint: setCurrentlyVisibleHintMock,
  });
  return {
    useHintState,
    initializeMock,
    completeHintMock,
    completeHintWithoutVisibilityMock,
    isCompletedMock,
    isAllSkippedMock,
    setSkipAllMock,
    currentlyVisibleHintMock,
    setCurrentlyVisibleHintMock,
  };
});

vi.mock("../../composables/useHintProvider", () => {
  const showHintMock = vi.fn();
  const closeHintMock = vi.fn();
  const createHintDataMock = vi.fn();

  return {
    useHintProvider: vi.fn().mockReturnValue({
      createHintData: createHintDataMock.mockReturnValue({
        showHint: showHintMock,
        closeHint: closeHintMock,
      }),
    }),
    createHintDataMock,
    showHintMock,
    closeHintMock,
  };
});

describe("useHint", () => {
  const hintConfigurationsMock: Record<string, HintConfiguration> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(hintConfigurationsMock).forEach((key) => {
      delete hintConfigurationsMock[key];
    });

    // @ts-ignore
    useHintState.isAllSkippedMock.value = false;
    // @ts-ignore
    useHintState.currentlyVisibleHintMock.value = null;
  });

  const doMount = ({
    isLoggedIn = true,
    loggedInUserId = "account:user:ead1c957-d8d2-468f-8788-b0df56f08380",
    hintKey = "someHint",
    hintConfig,
    skipAllHints = false,
    hintAlreadyCompleted = false,
    currentlyVisibleHint,
    alreadyCompletedHints = [],
    attachHintIdToElement = true,
  }: {
    isLoggedIn?: boolean;
    loggedInUserId?: string;
    hintKey?: string;
    hintConfig?: HintConfiguration;
    skipAllHints?: boolean;
    hintAlreadyCompleted?: boolean;
    currentlyVisibleHint?: string | null;
    alreadyCompletedHints?: Array<string>;
    attachHintIdToElement?: boolean;
  } = {}) => {
    // @ts-ignore
    hintConfigurationsMock[hintKey] = Object.assign(
      {
        title: "my hint",
        description: "this is a hint",
        align: "center",
        side: "bottom",
        dependsOn: [],
      },
      hintConfig,
    );

    // @ts-ignore
    useHintState.isAllSkippedMock.value = skipAllHints;
    // @ts-ignore
    useHintState.currentlyVisibleHintMock.value = currentlyVisibleHint;

    const completedHints = [
      ...new Set(
        [...alreadyCompletedHints, hintAlreadyCompleted && hintKey].filter(
          (hintId) => Boolean(hintId),
        ),
      ),
    ];
    // @ts-ignore
    useHintState.isCompletedMock.mockImplementation((hintId: string) =>
      completedHints.includes(hintId),
    );

    document.getElementById = vi.fn().mockReturnValue(attachHintIdToElement);

    const skipHints = !isLoggedIn;
    const uniqueUserId = loggedInUserId;
    const getRemoteHintState = () => vi.fn().mockResolvedValue({});
    const setRemoteHintState = () => vi.fn();

    setupHints({
      hints: hintConfigurationsMock,
      skipHints,
      uniqueUserId,
      // @ts-ignore
      getRemoteHintState,
      // @ts-ignore
      setRemoteHintState,
    });

    const { getComposableResult, lifeCycle } = mountComposable({
      composable: useHint,
      composableProps: { hintSetupId: "default" },
    });

    return {
      getComposableResult,
      lifeCycle,
      // @ts-ignore
      createHintDataMock: useHintProvider.createHintDataMock,
      // @ts-ignore
      showHintMock: useHintProvider.showHintMock,
      // @ts-ignore
      closeHintMock: useHintProvider.closeHintMock,
      useHintState: useHintState.useHintState,
      // @ts-ignore
      initializeMock: useHintState.initializeMock,
      // @ts-ignore
      completeHintMock: useHintState.completeHintMock,
      completeHintWithoutVisibilityMock:
        // @ts-ignore
        useHintState.completeHintWithoutVisibilityMock,
      // @ts-ignore
      isCompletedMock: useHintState.isCompletedMock,
      // @ts-ignore
      setSkipAllMock: useHintState.setSkipAllMock,
      // @ts-ignore
      currentlyVisibleHintMock: useHintState.currentlyVisibleHintMock,
      // @ts-ignore
      setCurrentlyVisibleHintMock: useHintState.setCurrentlyVisibleHintMock,
    };
  };

  it("does nothing when not logged in", () => {
    const { useHintState, initializeMock } = doMount({ isLoggedIn: false });

    expect(useHintState).not.toHaveBeenCalled();
    expect(initializeMock).not.toHaveBeenCalled();
  });

  it("returns method to check if a hint is completed", () => {
    const hintKey = "myHint";
    const { getComposableResult, isCompletedMock } = doMount({});
    const { isCompleted } = getComposableResult();
    isCompleted(hintKey);

    expect(isCompletedMock).toHaveBeenCalledWith(hintKey);
  });

  it("returns method to complete hint without a component", () => {
    const hintKey = "myHint";
    const { getComposableResult, completeHintWithoutVisibilityMock } = doMount(
      {},
    );
    const { completeHintWithoutComponent } = getComposableResult();
    completeHintWithoutComponent(hintKey);

    expect(completeHintWithoutVisibilityMock).toHaveBeenCalledWith(hintKey);
  });

  it.each([true, false])(
    "isAllSkipped returns %s if skipAll in state is set to same value",
    (allSkipped) => {
      const { getComposableResult } = doMount({ skipAllHints: allSkipped });
      const { isAllSkipped } = getComposableResult();

      expect(isAllSkipped.value).toBe(allSkipped);
    },
  );

  it("initializes useHintStore on mount", () => {
    const loggedInUserId = "account:user:3e7557ca-021a-450f-b09a-1a729b7f0197";
    const { useHintState, initializeMock } = doMount({
      isLoggedIn: true,
      loggedInUserId,
    });

    expect(useHintState).toHaveBeenCalled();
    expect(initializeMock).toHaveBeenCalled();
  });

  it("createHint creates hint", () => {
    const hintKey = "myHint";
    const hintConfig: HintConfiguration = {
      title: "my hint",
      description: "this is a hint",
      linkText: "some link",
      linkHref: "/path/to/resource",
      align: "center",
      side: "bottom",
      dependsOn: [],
    };
    const { getComposableResult, createHintDataMock } = doMount({
      hintKey,
      hintConfig,
    });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(createHintDataMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "my hint",
        description: "this is a hint",
        linkText: "some link",
        linkHref: "/path/to/resource",
        align: "center",
        side: "bottom",
      }),
    );
  });

  it("created hint can be completed", () => {
    const hintKey = "myHint";
    const { getComposableResult, createHintDataMock, completeHintMock } =
      doMount({
        hintKey,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    const completeHintCallback =
      createHintDataMock.mock.calls[0][0].onCompleteHint;
    completeHintCallback();
    expect(completeHintMock).toHaveBeenCalledWith(hintKey);
  });

  it("created hint can trigger skip all", () => {
    const hintKey = "myHint";
    const { getComposableResult, createHintDataMock, setSkipAllMock } = doMount(
      {
        hintKey,
      },
    );
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    const skippAllHintsCallback =
      createHintDataMock.mock.calls[0][0].onSkipAllHints;
    skippAllHintsCallback();
    expect(setSkipAllMock).toHaveBeenCalled();
  });

  it("createHint does not create hint if no config available", () => {
    const hintKey = "unknwonHint";
    const { getComposableResult, createHintDataMock } = doMount({
      isLoggedIn: true,
    });
    const { createHint } = getComposableResult();

    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(createHintDataMock).not.toHaveBeenCalled();
  });

  it("createHint provides callback to complete hint", () => {
    const hintKey = "myHint";
    const { getComposableResult, closeHintMock } = doMount({
      hintKey,
    });
    const { createHint, getCompleteHintComponentCallback } =
      getComposableResult();

    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });
    const completeHint = getCompleteHintComponentCallback(hintKey);
    completeHint();

    expect(closeHintMock).toHaveBeenCalled();
  });

  it("created hint is shown when visibility conditions are true", () => {
    const hintKey = "myHint";
    const hintConfig: HintConfiguration = {
      dependsOn: [],
      title: "",
      description: "",
    };
    const {
      getComposableResult,
      showHintMock,
      isCompletedMock,
      setCurrentlyVisibleHintMock,
    } = doMount({
      hintKey,
      hintConfig,
      skipAllHints: false,
      hintAlreadyCompleted: false,
      currentlyVisibleHint: null,
    });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(showHintMock).toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).toHaveBeenCalledWith(hintKey);
    expect(isCompletedMock).toHaveBeenCalledWith(hintKey);
  });

  it("created hint is not shown when skip all is true", () => {
    const hintKey = "myHint";
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        skipAllHints: true,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(showHintMock).not.toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).not.toHaveBeenCalled();
  });

  it("created hint is not shown when hint was already completed", () => {
    const hintKey = "myHint";
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        hintAlreadyCompleted: true,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(showHintMock).not.toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).not.toHaveBeenCalled();
  });

  it("created hint is not shown when a different hint is currently shown", () => {
    const hintKey = "myHint";
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        currentlyVisibleHint: "differentHint",
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(showHintMock).not.toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).not.toHaveBeenCalled();
  });

  it("created hint is shown when the same hint is currently shown", () => {
    const hintKey = "myHint";
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        currentlyVisibleHint: hintKey,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(showHintMock).toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).toHaveBeenCalledWith(hintKey);
  });

  it("created hint is not shown when the dependent hints are not completed", () => {
    const dependencyHint = "otherHint";
    const secondDependencyHint = "secondOtherHint";
    const hintKey = "myHint";
    const hintConfig: HintConfiguration = {
      dependsOn: [dependencyHint, secondDependencyHint],
      title: "",
      description: "",
    };
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        hintConfig,
        alreadyCompletedHints: [secondDependencyHint],
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(showHintMock).not.toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).not.toHaveBeenCalled();
  });

  it("created hint is shown when the dependent hints are completed", () => {
    const dependencyHint = "otherHint";
    const hintKey = "myHint";
    const hintConfig: HintConfiguration = {
      dependsOn: [dependencyHint],
      title: "",
      description: "",
    };
    const {
      getComposableResult,
      showHintMock,
      isCompletedMock,
      setCurrentlyVisibleHintMock,
    } = doMount({
      hintKey,
      hintConfig,
      alreadyCompletedHints: [dependencyHint],
    });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });

    expect(showHintMock).toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).toHaveBeenCalledWith(hintKey);
    expect(isCompletedMock).toHaveBeenCalledWith(dependencyHint);
  });

  it("created hint is not shown when the hint condition returns false", () => {
    const hintKey = "myHint";
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(false),
    });

    expect(showHintMock).not.toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).not.toHaveBeenCalled();
  });

  it("visible hint is closed when before component is destroyed", () => {
    const hintKey = "myHint";
    const { getComposableResult, closeHintMock, lifeCycle, showHintMock } =
      doMount({
        hintKey,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });
    lifeCycle.unmount();

    expect(showHintMock).toHaveBeenCalled();
    expect(closeHintMock).toHaveBeenCalled();
  });

  it("visible hint is reset before component is destroyed", () => {
    const hintKey = "myHint";
    const { getComposableResult, lifeCycle, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(true),
    });
    lifeCycle.unmount();

    expect(setCurrentlyVisibleHintMock).toHaveBeenCalledWith(null);
  });

  it("not visible hint is not closed when before component is destroyed", () => {
    const hintKey = "myHint";
    const { getComposableResult, closeHintMock, lifeCycle, showHintMock } =
      doMount({
        hintKey,
      });
    const { createHint } = getComposableResult();
    createHint({
      hintId: hintKey,
      isVisibleCondition: ref(false),
    });
    lifeCycle.unmount();

    expect(showHintMock).not.toHaveBeenCalled();
    expect(closeHintMock).not.toHaveBeenCalled();
  });
});
