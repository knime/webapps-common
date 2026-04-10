import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import ExecutorCoresControl from "../ExecutorCoresControl.vue";
import ResourceControlBase from "../ResourceControlBase.vue";

describe("ExecutorCoresControl", () => {
  let props: VueControlTestProps<typeof ExecutorCoresControl>,
    wrapper: VueWrapper;

  const labelForId = "coresLabelId";
  const path = "executorCores";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase(path),
        data: 4,
        schema: {
          type: "number",
          minimum: 1,
          maximum: 16,
          // @ts-expect-error - secondaryValue is not part of the JSON schema spec but is used by the component
          secondaryValue: 2,
        },
        uischema: {
          type: "Control",
          scope: `#/properties/${path}`,
          options: {
            donutTitle: "vCore Tokens",
            donutMax: 20,
            currentUsage: 4,
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: true,
    };
    const component = mountJsonFormsControlLabelContent(ExecutorCoresControl, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders ResourceControlBase", () => {
    const base = wrapper.findComponent(ResourceControlBase);
    expect(base.exists()).toBe(true);
    expect(base.props().control).toEqual(props.control);
  });

  it("renders donut info", () => {
    expect(wrapper.find(".chart-title").text()).toBe("vCore Tokens");
    const description = wrapper.find(".chart-description").text();
    expect(description).toContain(
      "This execution context will use 2 vCore tokens.",
    );
    expect(description).toContain(
      "In total, 6 of 20 vCore tokens available for this team will be used.",
    );
  });

  it("displays info text for shared context", () => {
    props.control.uischema.options!.isSharedContext = true;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorCoresControl,
      {
        props,
      },
    );
    const description = wrapper.find(".chart-description").text();
    expect(description).toContain("from the license");
  });

  it("displays 'unlimited' when donutMax is -1", () => {
    props.control.uischema.options!.donutMax = -1;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorCoresControl,
      {
        props,
      },
    );
    const description = wrapper.find(".chart-description").text();
    expect(description).toContain("of unlimited vCore tokens");
  });

  it("calculates total use from currentUsage and secondaryValue", () => {
    // currentUsage = 4, secondaryValue = 2, total = 6
    const description = wrapper.find(".chart-description").text();
    expect(description).toContain("In total, 6 of");
  });

  it("uses default secondaryValue of 0 when not provided", () => {
    delete (props.control.schema as { secondaryValue?: number }).secondaryValue;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorCoresControl,
      {
        props,
      },
    );
    const description = wrapper.find(".chart-description").text();
    // currentUsage = 4, secondaryValue = 0, total = 4
    expect(description).toContain(
      "This execution context will use 0 vCore tokens.",
    );
    expect(description).toContain("In total, 4 of");
  });

  it("uses default empty string for donutTitle when not provided", () => {
    delete props.control.uischema.options!.donutTitle;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorCoresControl,
      {
        props,
      },
    );
    expect(wrapper.find(".chart-title").text()).toBe("");
  });
});
