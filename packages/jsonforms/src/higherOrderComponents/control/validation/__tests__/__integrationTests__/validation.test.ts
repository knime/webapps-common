import { describe, expect, it, vi } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";

import JsonFormsDialog from "../../../../../JsonFormsDialog.vue";
import { controls, layouts, toRenderers } from "../../../../../renderers";

describe("validation", () => {
  const mountJsonFormsDialog = async (data: {
    stringWithPattern?: string;
    doubleWithMinimum?: number;
  }) => {
    const wrapper = mount(JsonFormsDialog, {
      props: {
        data,
        schema: {
          type: "object",
          properties: {
            stringWithPattern: { type: "string" },
            doubleWithMinimum: { type: "number" },
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
          ],
        },
        renderers: toRenderers(
          [],
          [controls.textRenderer, controls.numberRenderer],
          [layouts.verticalLayoutFallbackRenderer],
        ),
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
});
