import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import ExecutorMemoryControl from "../ExecutorMemoryControl.vue";
import ResourceControlBase from "../ResourceControlBase.vue";

describe("ExecutorMemoryControl", () => {
  let props: VueControlTestProps<typeof ExecutorMemoryControl>,
    wrapper: VueWrapper;

  const labelForId = "memoryLabelId";
  const path = "executorMemory";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase(path),
        data: 8,
        schema: {
          type: "number",
          minimum: 1,
          maximum: 64,
          // @ts-expect-error - secondaryValue is not part of the JSON schema spec but is used by the component
          secondaryValue: 16,
        },
        uischema: {
          type: "Control",
          scope: `#/properties/${path}`,
          options: {
            donutTitle: "Memory Usage",
            donutMax: 128,
            currentUsage: 24,
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: true,
    };
    const component = mountJsonFormsControlLabelContent(ExecutorMemoryControl, {
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
    expect(wrapper.find(".chart-title").text()).toBe("Memory Usage");
    const description = wrapper.find(".chart-description").text();
    // secondaryValue = 16, currentUsage = 24, total = 40, donutMax = 128
    expect(description).toContain(
      "This execution context will use a maximum of 16 GB RAM.",
    );
    expect(description).toContain(
      "In total, 40 GB of 128 GB available for this team will be used.",
    );
  });

  it("calculates total use from secondaryValue and currentUsage", () => {
    // secondaryValue = 16, currentUsage = 24, total = 40
    const description = wrapper.find(".chart-description").text();
    expect(description).toContain("In total, 40 GB of");
  });

  it("uses default secondaryValue of 0 when not provided", () => {
    delete (props.control.schema as { secondaryValue?: number }).secondaryValue;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorMemoryControl,
      {
        props,
      },
    );
    const description = wrapper.find(".chart-description").text();
    // secondaryValue = 0, currentUsage = 24, total = 24
    expect(description).toContain(
      "This execution context will use a maximum of 0 GB RAM.",
    );
    expect(description).toContain("In total, 24 GB of");
  });

  it("uses default currentUsage of 0 when not provided", () => {
    delete props.control.uischema.options!.currentUsage;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorMemoryControl,
      {
        props,
      },
    );
    const description = wrapper.find(".chart-description").text();
    // secondaryValue = 16, currentUsage = 0, total = 16
    expect(description).toContain("In total, 16 GB of");
  });

  it("uses default empty string for donutTitle when not provided", () => {
    delete props.control.uischema.options!.donutTitle;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorMemoryControl,
      {
        props,
      },
    );
    expect(wrapper.find(".chart-title").text()).toBe("");
  });

  it("uses donutMax in info text", () => {
    props.control.uischema.options!.donutMax = 256;
    const { wrapper } = mountJsonFormsControlLabelContent(
      ExecutorMemoryControl,
      {
        props,
      },
    );
    const description = wrapper.find(".chart-description").text();
    expect(description).toContain("of 256 GB available");
  });
});
