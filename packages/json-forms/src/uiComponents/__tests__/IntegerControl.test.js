import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import ErrorMessage from "../ErrorMessage.vue";
import IntegerControl from "../IntegerControl.vue";
import NumberControlBase from "../NumberControlBase.vue";

describe("IntegerControl.vue", () => {
  let defaultProps, wrapper, component;

  beforeEach(async () => {
    defaultProps = {
      control: {
        ...getControlBase("path"),
        schema: {
          properties: {
            maxRows: {
              type: "integer",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: "integer",
          },
        },
      },
    };
    component = await mountJsonFormsComponent(IntegerControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(IntegerControl).exists()).toBe(true);
    expect(wrapper.getComponent(NumberControlBase).exists()).toBe(true);
    expect(
      wrapper.getComponent(IntegerControl).getComponent(ErrorMessage).exists(),
    ).toBe(true);
  });

  it("passes default props", () => {
    const numberControlProps = wrapper.getComponent(NumberControlBase).props();
    expect(numberControlProps.type).toBe("integer");
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(NumberControlBase),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });
});
