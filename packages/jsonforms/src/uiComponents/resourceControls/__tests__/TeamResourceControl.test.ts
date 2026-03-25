import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import ResourceControlBase from "../ResourceControlBase.vue";
import TeamResourceControl from "../TeamResourceControl.vue";

describe("TeamResourceControl", () => {
  let props: VueControlTestProps<typeof TeamResourceControl>,
    wrapper: VueWrapper;

  const labelForId = "teamResourceLabelId";
  const path = "teamResource";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase(path),
        data: 100,
        schema: {
          type: "number",
          minimum: 1,
          maximum: 500,
        },
        uischema: {
          type: "Control",
          scope: `#/properties/${path}`,
          options: {
            donutTitle: "Team Allocation",
            donutText: "vCore tokens allocated",
            currentUsage: 45,
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: true,
    };
    const component = mountJsonFormsControlLabelContent(TeamResourceControl, {
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
    expect(wrapper.find(".chart-title").text()).toBe("Team Allocation");
    const description = wrapper.find(".chart-description").text();
    // currentUsage = 45, data = 100, donutText = "vCore tokens allocated"
    expect(description).toBe("45 of 100 vCore tokens allocated");
  });

  it("displays 'unlimited' when data is -1", () => {
    props.control.data = -1;
    const { wrapper } = mountJsonFormsControlLabelContent(TeamResourceControl, {
      props,
    });
    const description = wrapper.find(".chart-description").text();
    expect(description).toBe("45 of unlimited vCore tokens allocated");
  });

  it("uses default empty string for donutTitle when not provided", () => {
    delete props.control.uischema.options!.donutTitle;
    const { wrapper } = mountJsonFormsControlLabelContent(TeamResourceControl, {
      props,
    });
    expect(wrapper.find(".chart-title").text()).toBe("");
  });

  it("uses default empty string for donutText when not provided", () => {
    delete props.control.uischema.options!.donutText;
    const { wrapper } = mountJsonFormsControlLabelContent(TeamResourceControl, {
      props,
    });
    const description = wrapper.find(".chart-description").text();
    expect(description).toBe("45 of 100");
  });

  it("uses currentUsage from options", () => {
    props.control.uischema.options!.currentUsage = 75;
    const { wrapper } = mountJsonFormsControlLabelContent(TeamResourceControl, {
      props,
    });
    const description = wrapper.find(".chart-description").text();
    expect(description).toContain("75 of");
  });

  it("handles undefined currentUsage", () => {
    delete props.control.uischema.options!.currentUsage;
    const { wrapper } = mountJsonFormsControlLabelContent(TeamResourceControl, {
      props,
    });
    const description = wrapper.find(".chart-description").text();
    expect(description).toBe("0 of 100 vCore tokens allocated");
  });
});
