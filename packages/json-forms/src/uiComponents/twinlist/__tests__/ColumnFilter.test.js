import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import ColumnFilter from "../ColumnFilter.vue";
import TwinlistControl from "../TwinlistControl.vue";

describe("ColumnFilter.vue", () => {
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
        typeFilter: {
          selectedTypes: [],
        },
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
          typeFilter: {
            type: "object",
            properties: {
              selectedTypes: {
                items: {
                  type: "string",
                },
                type: "array",
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
              {
                const: "TYPE",
                title: "Type",
              },
            ],
          },
          selected: {
            anyOf: [
              {
                const: "test_1",
                title: "test_1",
                columnType: "String",
              },
              {
                const: "test_2",
                title: "test_2",
                columnType: "Double",
              },
              {
                const: "test_3",
                title: "test_3",
                columnType: "String",
              },
            ],
          },
        },
      },
      uischema: {
        type: "Control",
        scope: "#/properties/xAxis",
        options: {
          format: "columnFilter",
        },
      },
    },
  };

  let wrapper, component;

  beforeEach(async () => {
    component = await mountJsonFormsComponent(ColumnFilter, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ColumnFilter).exists()).toBe(true);
    expect(wrapper.getComponent(TwinlistControl).exists()).toBe(true);
  });

  it("passes default props", () => {
    const twinListProps = wrapper.getComponent(TwinlistControl).props();
    expect(twinListProps.twinlistLeftLabel).toBe("Excludes");
    expect(twinListProps.twinlistRightLabel).toBe("Includes");
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(TwinlistControl),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });
});
