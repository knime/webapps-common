import { beforeEach, describe, expect, it, vi } from "vitest";
import { compact, merge, uniq } from "lodash-es";

import type { HintConfiguration } from "../../types";
import * as createHintUtil from "../../util/createHint";
import { useHint } from "../useHint";
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

vi.mock("../util/createHint", () => {
  const showHintMock = vi.fn();
  const closeHintMock = vi.fn();
  const createHintMock = vi.fn();

  return {
    createHint: createHintMock.mockReturnValue({
      showHint: showHintMock,
      closeHint: closeHintMock,
    }),
    createHintMock,
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

    useHintState.isAllSkippedMock.value = false;
    useHintState.currentlyVisibleHintMock.value = null;
  });

  const doMount = ({
    isLoggedIn = true,
    loggedInUserId = "account:user:ead1c957-d8d2-468f-8788-b0df56f08380",
    hintKey = "someHint",
    hintConfig = {},
    skipAllHints = false,
    hintAlreadyCompleted = false,
    currentlyVisibleHint = null,
    alreadyCompletedHints = [],
    attachHintIdToElement = true,
  } = {}) => {
    // @ts-ignore
    hintConfigurationsMock[hintKey] = merge(
      {
        title: "my hint",
        description: "this is a hint",
        align: "center",
        side: "bottom",
        dependsOn: [],
      },
      hintConfig,
    );

    useHintState.isAllSkippedMock.value = skipAllHints;
    useHintState.currentlyVisibleHintMock.value = currentlyVisibleHint;

    const completedHints = uniq(
      compact([...alreadyCompletedHints, hintAlreadyCompleted && hintKey]),
    );
    useHintState.isCompletedMock.mockImplementation((hintId: string) =>
      completedHints.includes(hintId),
    );

    document.getElementById = vi.fn().mockReturnValue(attachHintIdToElement);

    const skipHints = !isLoggedIn;
    const uniqueUserId = loggedInUserId;
    const getRemoteHintState = () => vi.fn().mockResolvedValue({});
    const setRemoteHintState = () => vi.fn();

    const { getComposableResult, lifeCycle } = mountComposable({
      composable: useHint,
      composableProps: {
        skipHints,
        uniqueUserId,
        // @ts-ignore
        getRemoteHintState,
        // @ts-ignore
        setRemoteHintState,
      },
    });

    return {
      getComposableResult,
      lifeCycle,
      createHintMock: createHintUtil.createHintMock,
      showHintMock: createHintUtil.showHintMock,
      closeHintMock: createHintUtil.closeHintMock,
      useHintState: useHintState.useHintState,
      initializeMock: useHintState.initializeMock,
      completeHintMock: useHintState.completeHintMock,
      completeHintWithoutVisibilityMock:
        useHintState.completeHintWithoutVisibilityMock,
      isCompletedMock: useHintState.isCompletedMock,
      setSkipAllMock: useHintState.setSkipAllMock,
      currentlyVisibleHintMock: useHintState.currentlyVisibleHintMock,
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

  it("createHintComponent creates hint", () => {
    const hintKey = "myHint";
    const hintConfig = {
      title: "my hint",
      description: "this is a hint",
      linkText: "some link",
      linkHref: "/path/to/resource",
      align: "center",
      side: "bottom",
      dependsOn: [],
    };
    const { getComposableResult, createHintMock } = doMount({
      hintKey,
      hintConfig,
    });
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    expect(createHintMock).toHaveBeenCalledWith(
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
    const { getComposableResult, createHintMock, completeHintMock } = doMount({
      hintKey,
    });
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    const completeHintCallback = createHintMock.mock.calls[0][0].onCompleteHint;
    completeHintCallback();
    expect(completeHintMock).toHaveBeenCalledWith(hintKey);
  });

  it("created hint can trigger skip all", () => {
    const hintKey = "myHint";
    const { getComposableResult, createHintMock, setSkipAllMock } = doMount({
      hintKey,
    });
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    const skippAllHintsCallback =
      createHintMock.mock.calls[0][0].onSkipAllHints;
    skippAllHintsCallback();
    expect(setSkipAllMock).toHaveBeenCalled();
  });

  it("createHintComponent does not create hint if no config available", () => {
    const hintKey = "unknwonHint";
    const { getComposableResult, createHintMock } = doMount({
      isLoggedIn: true,
    });
    const { createHintComponent } = getComposableResult();

    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    expect(createHintMock).not.toHaveBeenCalled();
  });

  it("createHintComponent provides callback to complete hint", () => {
    const hintKey = "myHint";
    const { getComposableResult, closeHintMock } = doMount({
      hintKey,
    });
    const { createHintComponent, getCompleteHintComponentCallback } =
      getComposableResult();

    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });
    const completeHint = getCompleteHintComponentCallback(hintKey);
    completeHint();

    expect(closeHintMock).toHaveBeenCalled();
  });

  it("created hint is shown when visibility conditions are true", () => {
    const hintKey = "myHint";
    const hintConfig = {
      dependsOn: [],
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    expect(showHintMock).toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).toHaveBeenCalledWith(hintKey);
    expect(isCompletedMock).toHaveBeenCalledWith(hintKey);
  });

  it("created hint is not shown if there is no element with corresponding id", () => {
    const hintKey = "myHint";
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        attachHintIdToElement: false,
      });
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    expect(showHintMock).not.toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).not.toHaveBeenCalled();
  });

  it("created hint is not shown when skipp all is true", () => {
    const hintKey = "myHint";
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        skipAllHints: true,
      });
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    expect(showHintMock).toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).toHaveBeenCalledWith(hintKey);
  });

  it("created hint is not shown when the dependent hints are not completed", () => {
    const dependencyHint = "otherHint";
    const secondDependencyHint = "secondOtherHint";
    const hintKey = "myHint";
    const hintConfig = {
      dependsOn: [dependencyHint, secondDependencyHint],
    };
    const { getComposableResult, showHintMock, setCurrentlyVisibleHintMock } =
      doMount({
        hintKey,
        hintConfig,
        alreadyCompletedHints: [secondDependencyHint],
      });
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
    });

    expect(showHintMock).not.toHaveBeenCalled();
    expect(setCurrentlyVisibleHintMock).not.toHaveBeenCalled();
  });

  it("created hint is shown when the dependent hints are completed", () => {
    const dependencyHint = "otherHint";
    const hintKey = "myHint";
    const hintConfig = {
      dependsOn: [dependencyHint],
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => false,
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => true,
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
    const { createHintComponent } = getComposableResult();
    createHintComponent({
      hintId: hintKey,
      checkHintVisibilityCondition: () => false,
    });
    lifeCycle.unmount();

    expect(showHintMock).not.toHaveBeenCalled();
    expect(closeHintMock).not.toHaveBeenCalled();
  });
});
