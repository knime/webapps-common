import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { Dropdown } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import OneOfDropdown from "../OneOfDropdown.vue";

describe("OneOfDropdown.vue", () => {
  let wrapper: VueWrapper, props: VueControlTestProps<typeof OneOfDropdown>;

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("path"),
        data: "Universe_0_0",
        schema: {
          oneOf: [
            {
              const: "Universe_0_0",
              title: "Universe_0_0",
            },
            {
              const: "Universe_0_1",
              title: "Universe_0_1",
            },
            {
              const: "Universe_1_0",
              title: "Universe_1_0",
            },
            {
              const: "Universe_1_1",
              title: "Universe_1_1",
            },
          ],
          title: "Y Axis Column",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/yAxisColumn",
        },
      },
      disabled: false,
      isValid: false,
      labelForId,
    };

    const component = mountJsonFormsControlLabelContent(OneOfDropdown, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.findComponent(Dropdown).props().id).toBe(labelForId);
  });

  it("computed dropdown options from oneof options", async () => {
    expect(await wrapper.getComponent(Dropdown).props().possibleValues).toEqual(
      [
        {
          id: "Universe_0_0",
          text: "Universe_0_0",
        },
        {
          id: "Universe_0_1",
          text: "Universe_0_1",
        },
        {
          id: "Universe_1_0",
          text: "Universe_1_0",
        },
        {
          id: "Universe_1_1",
          text: "Universe_1_1",
        },
      ],
    );
  });
});
