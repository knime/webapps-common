import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import DropdownControl from "../DropdownControl.vue";
import OneOfDropdown from "../OneOfDropdown.vue";

describe("OneOfDropdown.vue", () => {
  let wrapper, props, component;

  beforeEach(() => {
    props = {
      path: "",
      control: {
        ...getControlBase("path"),
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
    };

    component = mountJsonFormsComponent(OneOfDropdown, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(OneOfDropdown).exists()).toBe(true);
    expect(wrapper.getComponent(DropdownControl).exists()).toBe(true);
  });

  it("passes default props", () => {
    const dropdownProps = wrapper.getComponent(DropdownControl).props();
    expect(dropdownProps.optionsGenerator).toBe(wrapper.vm.optionsGenerator);
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(DropdownControl),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });

  it("computed dropdown options from oneof options", async () => {
    expect(
      await wrapper.getComponent(DropdownControl).props().asyncInitialOptions,
    ).toEqual([
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
    ]);
  });
});
