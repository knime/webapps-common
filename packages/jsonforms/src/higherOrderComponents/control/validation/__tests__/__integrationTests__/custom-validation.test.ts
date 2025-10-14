import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { VueWrapper, mount } from "@vue/test-utils";

import { InputField } from "@knime/components";

import JsonFormsDialog from "../../../../../JsonFormsDialog.vue";
import { controls, layouts, toRenderers } from "../../../../../renderers";

describe("custom validation", () => {
  const mountJsonFormsDialog = async () => {
    const validateFn = vi.fn((id: string, value: unknown) => {
      if (value === "invalid") {
        return Promise.resolve(`Validation error for ${id}`);
      }
      if (value === "invalid2") {
        return Promise.resolve(`Updated validation error for ${id}`);
      }
      return Promise.resolve(null);
    });

    const wrapper = mount(JsonFormsDialog, {
      props: {
        data: { testField: "initial" },
        schema: {
          type: "object",
          properties: {
            testField: { type: "string" },
          },
        },
        uischema: {
          // @ts-expect-error Object literal may only specify known properties, and 'elements' does not exist in type 'UISchemaElement'.
          elements: [
            {
              type: "Control",
              scope: "#/properties/testField",
            },
          ],
        },
        renderers: toRenderers({
          renderers: [],
          controls: [controls.textRenderer],
          layouts: [layouts.verticalLayoutFallbackRenderer],
        }),
        validate: validateFn,
      },
      attachTo: document.body,
    }) as VueWrapper;

    await vi.dynamicImportSettled();

    return { wrapper, validateFn };
  };

  const getStateProviderCallback = async (wrapper: VueWrapper) => {
    await nextTick(); // Wait for component to mount and emit stateProviderListener

    const stateProviderEvents = wrapper.emitted("stateProviderListener");
    expect(stateProviderEvents).toBeDefined();
    expect(stateProviderEvents!.length).toBeGreaterThan(0);

    const [_identifier, callback] = stateProviderEvents![0] as [
      unknown,
      (value: unknown) => void,
    ];

    return callback;
  };

  it("triggers validation when validator is provided", async () => {
    vi.useFakeTimers();
    const { wrapper, validateFn } = await mountJsonFormsDialog();
    const stateProviderCallback = await getStateProviderCallback(wrapper);

    stateProviderCallback("validator1");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(validateFn).toHaveBeenCalledWith("validator1", "initial");
    expect(wrapper.text()).not.toContain("Validation error for validator1");
  });

  it("shows error when value becomes invalid", async () => {
    vi.useFakeTimers();
    const { wrapper, validateFn } = await mountJsonFormsDialog();
    const stateProviderCallback = await getStateProviderCallback(wrapper);

    stateProviderCallback("validator1");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    const inputField = wrapper.findComponent(InputField);
    inputField.vm.$emit("update:modelValue", "invalid");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(validateFn).toHaveBeenCalledWith("validator1", "invalid");
    expect(wrapper.text()).toContain("Validation error for validator1");
  });

  it("updates error message when value changes to another invalid value", async () => {
    vi.useFakeTimers();
    const { wrapper, validateFn } = await mountJsonFormsDialog();
    const stateProviderCallback = await getStateProviderCallback(wrapper);

    stateProviderCallback("validator1");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    const inputField = wrapper.findComponent(InputField);
    inputField.vm.$emit("update:modelValue", "invalid");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    inputField.vm.$emit("update:modelValue", "invalid2");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(validateFn).toHaveBeenCalledWith("validator1", "invalid2");
    expect(wrapper.text()).toContain("Updated validation error for validator1");
    expect(wrapper.text()).not.toContain("Validation error for validator1");
  });

  it("removes error when value becomes valid", async () => {
    vi.useFakeTimers();
    const { wrapper, validateFn } = await mountJsonFormsDialog();
    const stateProviderCallback = await getStateProviderCallback(wrapper);

    stateProviderCallback("validator1");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    const inputField = wrapper.findComponent(InputField);
    inputField.vm.$emit("update:modelValue", "invalid");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain("Validation error for validator1");

    inputField.vm.$emit("update:modelValue", "valid");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(validateFn).toHaveBeenCalledWith("validator1", "valid");
    expect(wrapper.text()).not.toContain("Validation error for validator1");
  });

  it("removes error when validator is set to null", async () => {
    vi.useFakeTimers();
    const { wrapper } = await mountJsonFormsDialog();
    const stateProviderCallback = await getStateProviderCallback(wrapper);

    stateProviderCallback("validator1");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    const inputField = wrapper.findComponent(InputField);
    inputField.vm.$emit("update:modelValue", "invalid");
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain("Validation error for validator1");

    stateProviderCallback(null);
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    expect(wrapper.text()).not.toContain("Validation error for validator1");
  });
});
