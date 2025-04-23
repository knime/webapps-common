import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { VueWrapper, mount } from "@vue/test-utils";

import { InputField } from "@knime/components";

import JsonFormsDialog from "../../../../../JsonFormsDialog.vue";
import { controls, layouts, toRenderers } from "../../../../../renderers";

describe("validation", () => {
  const mountJsonFormsDialog = async (data: {
    stringWithPattern?: string;
    doubleWithMinimum?: number;
    stringWithExternalValidation?: string;
  }) => {
    const wrapper = mount(JsonFormsDialog, {
      props: {
        data,
        schema: {
          type: "object",
          properties: {
            stringWithPattern: { type: "string" },
            doubleWithMinimum: { type: "number" },
            stringWithExternalValidation: { type: "string" },
          },
        },
        uischema: {
          // @ts-expect-error Object literal may only specify known properties, and 'elements' does not exist in type 'UISchemaElement'.
          elements: [
            {
              type: "Control",
              scope: "#/properties/stringWithPattern",
              options: {
                validations: [
                  {
                    id: "pattern",
                    parameters: { value: "." },
                    errorMessage: "The value has to match the pattern '.'",
                  },
                ],
              },
            },
            {
              type: "Control",
              scope: "#/properties/doubleWithMinimum",
              options: {
                validations: [
                  {
                    id: "min",
                    parameters: {
                      value: 1,
                      isExclusive: false,
                    },
                    errorMessage: "The value has to be at least 1",
                  },
                ],
                format: "number",
              },
            },
            {
              type: "Control",
              scope: "#/properties/stringWithExternalValidation",
              options: {
                externalValidationHandler: "externalValidationHandlerId",
              },
            },
          ],
        },
        renderers: toRenderers({
          renderers: [],
          controls: [controls.textRenderer, controls.numberRenderer],
          layouts: [layouts.verticalLayoutFallbackRenderer],
          config: {
            performExternalValidation: (id: string, value: unknown) =>
              Promise.resolve(
                `External validation executed for ${id} with value ${value}`,
              ),
          },
        }),
      },
      attachTo: document.body,
    }) as VueWrapper;
    await vi.dynamicImportSettled();
    return wrapper;
  };

  it("validates text controls", async () => {
    const wrapper = await mountJsonFormsDialog({ stringWithPattern: "abc" });
    expect(wrapper.text()).toContain("The value has to match the pattern '.'");
  });

  it("validates number controls", async () => {
    const wrapper = await mountJsonFormsDialog({ doubleWithMinimum: -1 });
    expect(wrapper.text()).toContain("The value has to be at least 1");
  });

  it("executes external validation for text controls", async () => {
    vi.useFakeTimers();
    const wrapper = await mountJsonFormsDialog({
      stringWithExternalValidation: "abc",
    });
    const inputField = wrapper.findAllComponents(InputField).at(1);
    inputField?.vm.$emit("update:modelValue", "abcd");
    vi.runAllTimers(); // skip debounce behavior
    await nextTick(); // wait for combined messages to be updated
    await nextTick(); // wait until the DOM is updated
    expect(wrapper.text()).toContain(
      "External validation executed for externalValidationHandlerId with value abcd",
    );
  });
});
