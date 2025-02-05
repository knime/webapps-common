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
            stringWithPattern: { type: "string", pattern: "." },
            doubleWithMinimum: { type: "number", format: "number" },
          },
        },
        uischema: {
          // @ts-expect-error
          elements: [
            {
              type: "Control",
              scope: "#/properties/stringWithPattern",
            },
            {
              type: "Control",
              scope: "#/properties/doubleWithMinimum",
              options: {
                min: 1,
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
    expect(wrapper.text()).toContain('The value has to match the pattern "."');
  });

  it("validates number controls", async () => {
    const wrapper = await mountJsonFormsDialog({ doubleWithMinimum: -1 });
    expect(wrapper.text()).toContain("The value has to be at least 1");
  });
});
