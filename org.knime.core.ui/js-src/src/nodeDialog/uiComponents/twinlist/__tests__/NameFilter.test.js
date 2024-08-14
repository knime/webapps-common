import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import NameFilter from "../NameFilter.vue";
import TwinlistControl from "../TwinlistControl.vue";
import { Twinlist } from "@knime/components";

describe("NameFilter.vue", () => {
  const defaultProps = {
    path: "",
    control: {
      ...getControlBase("path"),
      data: {
        patternFilter: {
          pattern: "",
          isInverted: false,
          isCaseSensitive: false,
        },
        manualFilter: {
          manuallySelected: ["test_1"],
          manuallyDeselected: ["test_2"],
          includeUnknownColumns: false,
        },
        mode: "manual",
        selected: ["test_1"],
      },
      schema: {
        type: "object",
        properties: {
          patternFilter: {
            type: "object",
            properties: {
              isCaseSensitive: {
                type: "boolean",
              },
              isInverted: {
                type: "boolean",
              },
              pattern: {
                type: "string",
              },
            },
          },
          manualFilter: {
            type: "object",
            properties: {
              manuallySelected: {
                items: {
                  type: "string",
                },
                type: "array",
              },
              manuallyDeselected: {
                items: {
                  type: "string",
                },
                type: "array",
              },
              includeUnknownColumns: {
                type: "boolean",
              },
            },
          },
          mode: {
            oneOf: [
              {
                const: "MANUAL",
                title: "Manual",
              },
              {
                const: "REGEX",
                title: "Regex",
              },
              {
                const: "WILDCARD",
                title: "Wildcard",
              },
            ],
          },
          selected: {
            anyOf: [
              {
                const: "test_1",
                title: "test_1",
              },
              {
                const: "test_2",
                title: "test_2",
              },
              {
                const: "test_3",
                title: "test_3",
              },
            ],
          },
        },
      },
      uischema: {
        type: "Control",
        scope: "#/properties/xAxis",
        options: {
          format: "nameFilter",
        },
      },
    },
  };

  let wrapper, component;

  beforeEach(async () => {
    component = await mountJsonFormsComponent(NameFilter, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(NameFilter).exists()).toBe(true);
    expect(wrapper.getComponent(TwinlistControl).exists()).toBe(true);
    expect(wrapper.getComponent(Twinlist).exists()).toBe(true);
  });

  it("passes default props", () => {
    const twinListProps = wrapper.getComponent(Twinlist).props();
    expect(twinListProps.unknownValuesText).toBe("Any unknown value");
    expect(twinListProps.emptyStateLabel).toBe("No values in this list");
    expect(twinListProps.modelValue).toStrictEqual({
      includedValues: ["test_1"],
      excludedValues: ["test_2"],
      includeUnknownValues: false,
    });
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(TwinlistControl),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });
});
