/* eslint-disable class-methods-use-this */
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import {
  APILayerDirtyState,
  ApplyState,
  DefaultSettingComparator,
  ViewState,
} from "@/index";
import { createDialogDirtyStateHandler } from "@/services/dialogDirtyState";

describe("dialogDirtyState", () => {
  type AddSetting = ReturnType<
    typeof createDialogDirtyStateHandler
  >["addSetting"];
  type OnApply = ReturnType<typeof createDialogDirtyStateHandler>["onApply"];

  let addSetting: AddSetting,
    onApply: OnApply,
    dirtyState: APILayerDirtyState | undefined,
    onDirtyStateChange: Mock;

  beforeEach(() => {
    dirtyState = {
      apply: ApplyState.CLEAN,
      view: ViewState.CLEAN,
    };
    onDirtyStateChange = vi.fn((newDirtyState: APILayerDirtyState) => {
      dirtyState = newDirtyState;
    });
    const handler = createDialogDirtyStateHandler(onDirtyStateChange);
    addSetting = handler.addSetting;
    onApply = handler.onApply;
  });

  const expectCleanStateAfterApply = () => {
    onApply();
    expect(dirtyState).toStrictEqual({
      apply: ApplyState.CLEAN,
      view: ViewState.CLEAN,
    });
  };

  const expectIdleStateAfterApply = () => {
    onApply();
    expect(dirtyState).toStrictEqual({
      apply: ApplyState.IDLE,
      view: ViewState.IDLE,
    });
  };

  it("combines dirty states of multiple setting", () => {
    addSetting("model")({ initialValue: "foo" })
      .addControllingFlowVariable("flowVarName")
      .unset();
    expect(dirtyState).toStrictEqual({
      apply: ApplyState.CONFIG,
      view: ViewState.CLEAN,
    });
    addSetting("view")({ initialValue: "foo" }).setValue("bar");
    expect(dirtyState).toStrictEqual({
      apply: ApplyState.CONFIG,
      view: ViewState.EXEC,
    });
    expectCleanStateAfterApply();
  });

  it("only emits one change on apply", () => {
    addSetting("model")({ initialValue: "foo" })
      .addControllingFlowVariable("flowVarName")
      .unset();
    addSetting("view")({ initialValue: "foo" }).setValue("bar");

    vi.resetAllMocks();

    onApply();

    expect(onDirtyStateChange).toHaveBeenCalledTimes(1);
  });

  it("used custom comparators if provided", () => {
    type ABC = "A1" | "A2" | "B";
    class CustomComparator extends DefaultSettingComparator<ABC, ABC> {
      toInternalState(cleanSettings: ABC): ABC {
        return cleanSettings;
      }

      equals(newState: ABC, cleanState: ABC): boolean {
        return newState[0] === cleanState[0];
      }
    }

    const setting = addSetting("model")<ABC>({
      initialValue: "A1",
      valueComparator: new CustomComparator(),
    });

    expect(dirtyState).toStrictEqual({
      apply: ApplyState.CLEAN,
      view: ViewState.CLEAN,
    });

    setting.setValue("B");

    expect(dirtyState).toStrictEqual({
      apply: ApplyState.CONFIG,
      view: ViewState.CONFIG,
    });

    setting.setValue("A2");

    expect(dirtyState).toStrictEqual({
      apply: ApplyState.CLEAN,
      view: ViewState.CLEAN,
    });

    expectCleanStateAfterApply();
  });

  describe.each(["model" as const, "view" as const])(
    "general flow variable behavior (for a %s setting)",
    (modelOrView) => {
      let addModelOrViewSetting: ReturnType<typeof addSetting>;

      beforeEach(() => {
        addModelOrViewSetting = addSetting(modelOrView);
      });

      it("reacts on dirty exposed variable", () => {
        const setting = addModelOrViewSetting({
          initialValue: "foo",
        });
        const exposedVariable = setting.addExposedFlowVariable("myVar");
        exposedVariable.set("otherVar");

        expect(dirtyState).toStrictEqual({
          apply: ApplyState.CONFIG,
          view: ViewState.CLEAN,
        });

        expectCleanStateAfterApply();
      });

      it("reacts on flawed controlling variable", () => {
        const setting = addModelOrViewSetting({
          initialValue: "foo",
        });
        const controllingVariable = setting.addControllingFlowVariable("myVar");
        controllingVariable.set("otherVar", { isFlawed: true });

        expect(dirtyState).toStrictEqual({
          apply: ApplyState.IDLE,
          view: ViewState.IDLE,
        });

        expectIdleStateAfterApply();
      });

      it("sets and unsets controlling variable", () => {
        const setting = addModelOrViewSetting({
          initialValue: "foo",
        });
        const controllingVariable = setting.addControllingFlowVariable("myVar");
        controllingVariable.set("otherVar");
        expect(dirtyState).not.toStrictEqual({
          apply: ApplyState.CLEAN,
          view: ViewState.CLEAN,
        });
        controllingVariable.unset();

        expect(dirtyState).not.toStrictEqual({
          apply: ApplyState.CLEAN,
          view: ViewState.CLEAN,
        });

        controllingVariable.set("myVar");

        expect(dirtyState).toStrictEqual({
          apply: ApplyState.CLEAN,
          view: ViewState.CLEAN,
        });
      });

      it("sets and unsets exposed variable", () => {
        const setting = addModelOrViewSetting({
          initialValue: "foo",
        });
        const exposedVariable = setting.addExposedFlowVariable("myVar");
        exposedVariable.set("otherVar");
        expect(dirtyState).not.toStrictEqual({
          apply: ApplyState.CLEAN,
          view: ViewState.CLEAN,
        });
        exposedVariable.unset();

        expect(dirtyState).not.toStrictEqual({
          apply: ApplyState.CLEAN,
          view: ViewState.CLEAN,
        });

        exposedVariable.set("myVar");

        expect(dirtyState).toStrictEqual({
          apply: ApplyState.CLEAN,
          view: ViewState.CLEAN,
        });
      });
    },
  );

  describe("view settings", () => {
    let addViewSetting: ReturnType<typeof addSetting>;

    beforeEach(() => {
      addViewSetting = addSetting("view");
    });

    it("reacts on dirty view settings", () => {
      const setting = addViewSetting({
        initialValue: "foo",
      });
      setting.setValue("bar");

      expect(dirtyState).toStrictEqual({
        apply: ApplyState.EXEC,
        view: ViewState.EXEC,
      });
      expectCleanStateAfterApply();
    });

    it("reacts on setting an exposed variable on a dirty view setting", () => {
      const setting = addViewSetting({
        initialValue: "foo",
      });
      setting.setValue("bar");
      setting.addExposedFlowVariable("myVar");

      expect(dirtyState).toStrictEqual({
        apply: ApplyState.CONFIG,
        view: ViewState.EXEC,
      });
      expectCleanStateAfterApply();
    });

    it("reacts on dirty view setting with a set exposed variable", () => {
      const setting = addViewSetting({
        initialValue: "foo",
      });
      setting.addExposedFlowVariable("myVar");
      setting.setValue("bar");

      expect(dirtyState).toStrictEqual({
        apply: ApplyState.CONFIG,
        view: ViewState.EXEC,
      });
      expectCleanStateAfterApply();
    });

    it("reacts on dirty view setting with a null exposed variable", () => {
      const setting = addViewSetting({
        initialValue: "foo",
      });
      setting.addExposedFlowVariable(null);
      setting.setValue("bar");

      expect(dirtyState).toStrictEqual({
        apply: ApplyState.EXEC,
        view: ViewState.EXEC,
      });
      expectCleanStateAfterApply();
    });

    it("reacts on dirty controlling variable", () => {
      const setting = addViewSetting({
        initialValue: "foo",
      });
      const controllingVariable = setting.addControllingFlowVariable("myVar");
      controllingVariable.set("otherVar");

      expect(dirtyState).toStrictEqual({
        apply: ApplyState.EXEC,
        view: ViewState.CLEAN,
      });
      expectCleanStateAfterApply();
    });
  });

  describe("model settings", () => {
    let addModelSetting: ReturnType<typeof addSetting>;

    beforeEach(() => {
      addModelSetting = addSetting("model");
    });

    it("reacts on dirty model settings", () => {
      const setting = addModelSetting({
        initialValue: "foo",
      });
      setting.setValue("bar");

      expect(dirtyState).toStrictEqual({
        apply: ApplyState.CONFIG,
        view: ViewState.CONFIG,
      });
      expectCleanStateAfterApply();
    });

    it("reacts on dirty controlling variable", () => {
      const setting = addModelSetting({
        initialValue: "foo",
      });
      const controllingVariable = setting.addControllingFlowVariable("myVar");
      controllingVariable.set("otherVar");

      expect(dirtyState).toStrictEqual({
        apply: ApplyState.CONFIG,
        view: ViewState.CLEAN,
      });
      expectCleanStateAfterApply();
    });
  });
});
