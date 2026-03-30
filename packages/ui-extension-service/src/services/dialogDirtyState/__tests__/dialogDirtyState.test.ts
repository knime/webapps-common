/* eslint-disable class-methods-use-this */
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import type { APILayerDirtyState } from "@knime/ui-extension-renderer/api";

import { DefaultSettingComparator } from "../../../index";
import { createDialogDirtyStateHandler } from "../../dialogDirtyState";

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
      apply: "clean",
      view: "clean",
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
      apply: "clean",
      view: "clean",
    });
  };

  it("combines dirty states of multiple setting", () => {
    addSetting("model")({ initialValue: "foo" })
      .addControllingFlowVariable("flowVarName")
      .unset();
    expect(dirtyState).toStrictEqual({
      apply: "configured",
      view: "clean",
    });
    addSetting("view")({ initialValue: "foo" }).setValue("bar");
    expect(dirtyState).toStrictEqual({
      apply: "configured",
      view: "executed",
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
      apply: "clean",
      view: "clean",
    });

    setting.setValue("B");

    expect(dirtyState).toStrictEqual({
      apply: "configured",
      view: "configured",
    });

    setting.setValue("A2");

    expect(dirtyState).toStrictEqual({
      apply: "clean",
      view: "clean",
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
          apply: "configured",
          view: "clean",
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
          apply: "idle",
          view: "idle",
        });

        expectCleanStateAfterApply();
      });

      it("sets and unsets controlling variable", () => {
        const setting = addModelOrViewSetting({
          initialValue: "foo",
        });
        const controllingVariable = setting.addControllingFlowVariable("myVar");
        controllingVariable.set("otherVar");
        expect(dirtyState).not.toStrictEqual({
          apply: "clean",
          view: "clean",
        });
        controllingVariable.unset();

        expect(dirtyState).not.toStrictEqual({
          apply: "clean",
          view: "clean",
        });

        controllingVariable.set("myVar");

        expect(dirtyState).toStrictEqual({
          apply: "clean",
          view: "clean",
        });
      });

      it("sets and unsets exposed variable", () => {
        const setting = addModelOrViewSetting({
          initialValue: "foo",
        });
        const exposedVariable = setting.addExposedFlowVariable("myVar");
        exposedVariable.set("otherVar");
        expect(dirtyState).not.toStrictEqual({
          apply: "clean",
          view: "clean",
        });
        exposedVariable.unset();

        expect(dirtyState).not.toStrictEqual({
          apply: "clean",
          view: "clean",
        });

        exposedVariable.set("myVar");

        expect(dirtyState).toStrictEqual({
          apply: "clean",
          view: "clean",
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
        apply: "executed",
        view: "executed",
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
        apply: "configured",
        view: "executed",
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
        apply: "configured",
        view: "executed",
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
        apply: "executed",
        view: "executed",
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
        apply: "executed",
        view: "clean",
      });
      expectCleanStateAfterApply();
    });
  });

  describe("cleanPreserving operations", () => {
    it("setValue with cleanPreserving does not dirty when currently clean", () => {
      const setting = addSetting("model")({ initialValue: "foo" });
      setting.setValue("bar", { cleanPreserving: true });
      expect(dirtyState).toStrictEqual({ apply: "clean", view: "clean" });
      // further change from new baseline is detected as dirty
      setting.setValue("baz");
      expect(dirtyState).toStrictEqual({
        apply: "configured",
        view: "configured",
      });
      // reverting to the post-migration baseline is clean again
      setting.setValue("bar");
      expect(dirtyState).toStrictEqual({ apply: "clean", view: "clean" });
    });

    it("setValue with cleanPreserving does dirty when already dirty", () => {
      const setting = addSetting("model")({ initialValue: "foo" });
      setting.setValue("bar");
      expect(dirtyState).toStrictEqual({
        apply: "configured",
        view: "configured",
      });
      // cleanPreserving is ignored because state was already dirty
      setting.setValue("baz", { cleanPreserving: true });
      expect(dirtyState).toStrictEqual({
        apply: "configured",
        view: "configured",
      });
    });

    it("controlling flow variable set with cleanPreserving does not dirty when currently clean", () => {
      const setting = addSetting("model")({ initialValue: "foo" });
      const controllingVariable = setting.addControllingFlowVariable(null);
      controllingVariable.set("myVar", { cleanPreserving: true });
      expect(dirtyState).toStrictEqual({ apply: "clean", view: "clean" });
      // further change from new baseline is detected
      controllingVariable.set("otherVar");
      expect(dirtyState).not.toStrictEqual({ apply: "clean", view: "clean" });
    });

    it("controlling flow variable set with cleanPreserving is ignored when already dirty", () => {
      const setting = addSetting("model")({ initialValue: "foo" });
      const controllingVariable = setting.addControllingFlowVariable(null);
      controllingVariable.set("myVar");
      expect(dirtyState).not.toStrictEqual({ apply: "clean", view: "clean" });
      controllingVariable.set("otherVar", { cleanPreserving: true });
      expect(dirtyState).not.toStrictEqual({ apply: "clean", view: "clean" });
    });

    it("controlling flow variable unset with cleanPreserving does not dirty when currently clean", () => {
      const setting = addSetting("model")({ initialValue: "foo" });
      const controllingVariable = setting.addControllingFlowVariable("myVar");
      controllingVariable.unset({ cleanPreserving: true });
      expect(dirtyState).toStrictEqual({ apply: "clean", view: "clean" });
    });

    it("exposed flow variable set with cleanPreserving does not dirty when currently clean", () => {
      const setting = addSetting("model")({ initialValue: "foo" });
      const exposedVariable = setting.addExposedFlowVariable(null);
      exposedVariable.set("myVar", { cleanPreserving: true });
      expect(dirtyState).toStrictEqual({ apply: "clean", view: "clean" });
    });

    it("exposed flow variable unset with cleanPreserving does not dirty when currently clean", () => {
      const setting = addSetting("model")({ initialValue: "foo" });
      const exposedVariable = setting.addExposedFlowVariable("myVar");
      exposedVariable.unset({ cleanPreserving: true });
      expect(dirtyState).toStrictEqual({ apply: "clean", view: "clean" });
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
        apply: "configured",
        view: "configured",
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
        apply: "configured",
        view: "clean",
      });
      expectCleanStateAfterApply();
    });
  });
});
