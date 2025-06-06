import { describe, expect, it, vi } from "vitest";
import { VueWrapper, flushPromises, mount } from "@vue/test-utils";

import { Checkbox, InputField } from "@knime/components";

import JsonFormsDialog from "../../../../JsonFormsDialog.vue";
import { controls, toRenderers } from "../../../../renderers";

describe("hide on null", () => {
  let wrapper: VueWrapper;

  const findCheckbox = (wrapper: VueWrapper) => wrapper.findComponent(Checkbox);

  const defaultValue = "default value";

  const mountJsonFormsDialog = async (
    {
      initialData,
      hideOnNull,
    }: {
      initialData: string | null;
      hideOnNull: boolean;
    } = {
      initialData: "",
      hideOnNull: false,
    },
  ) => {
    const data = { setting: initialData };
    wrapper = mount(JsonFormsDialog, {
      props: {
        data,
        schema: {
          type: "object",
          properties: {
            setting: { type: "string" },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/setting",
          ...(hideOnNull
            ? { options: { hideOnNull, default: defaultValue } }
            : {}),
        },
        renderers: toRenderers({
          renderers: [],
          controls: [controls.textRenderer],
          layouts: [],
        }),
      },
      attachTo: document.body,
    }) as VueWrapper;
    await vi.dynamicImportSettled();
  };

  it("does not show checkbox per default", async () => {
    await mountJsonFormsDialog();
    const checkbox = findCheckbox(wrapper);
    expect(checkbox.exists()).toBeFalsy();
  });

  it("shows checkbox which is checked on a null value", async () => {
    await mountJsonFormsDialog({
      initialData: null,
      hideOnNull: true,
    });
    const checkbox = findCheckbox(wrapper);
    expect(checkbox.exists()).toBeTruthy();
    expect(checkbox.props().modelValue).toBe(false);
  });

  it("sets the value to the default value and sets focus to input element when checking the checkbox", async () => {
    await mountJsonFormsDialog({
      initialData: null,
      hideOnNull: true,
    });
    const checkbox = findCheckbox(wrapper);
    await checkbox.vm.$emit("update:modelValue", true);
    // @ts-expect-error Object is of type 'unknown'
    expect(wrapper.emitted("change")[1][0].data.setting).not.toBeNull();
    await flushPromises();
    expect(wrapper.findComponent(InputField).props()).toMatchObject({
      modelValue: defaultValue,
    });
    expect(document.activeElement).toBe(
      wrapper.findComponent(InputField).find("input").element,
    );
  });

  it("shows checkbox which is checked on a non null value", async () => {
    await mountJsonFormsDialog({
      initialData: "",
      hideOnNull: true,
    });
    const checkbox = findCheckbox(wrapper);
    expect(checkbox.exists()).toBeTruthy();
    expect(checkbox.props().modelValue).toBe(true);
  });

  it("sets the value to null when unchecking the checkbox", async () => {
    await mountJsonFormsDialog({
      initialData: "",
      hideOnNull: true,
    });
    const checkbox = findCheckbox(wrapper);
    await checkbox.vm.$emit("update:modelValue", false);
    // @ts-expect-error Object is of type 'unknown'
    expect(wrapper.emitted("change")[1][0].data.setting).toBeNull();
  });
});
