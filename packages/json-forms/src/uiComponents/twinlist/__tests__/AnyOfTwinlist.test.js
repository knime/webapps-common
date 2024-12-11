import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "../../../../test-setup/utils/jsonFormsTestUtils";
import AnyOfTwinlist from "../AnyOfTwinlist.vue";
import SimpleTwinlistControl from "../SimpleTwinlistControl.vue";

describe("AnyOfTwinlist.vue", () => {
  let wrapper, props, component;

  beforeEach(async () => {
    props = {
      path: "",
      control: {
        ...getControlBase("path"),
        schema: {
          anyOf: [
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
          scope: "#/properties/view/properties/frequencies",
        },
      },
    };

    component = await mountJsonFormsComponent(AnyOfTwinlist, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(AnyOfTwinlist).exists()).toBe(true);
    expect(wrapper.getComponent(SimpleTwinlistControl).exists()).toBe(true);
  });

  it("passes default props", () => {
    const dropdownProps = wrapper.getComponent(SimpleTwinlistControl).props();
    expect(dropdownProps.optionsGenerator).toBe(wrapper.vm.optionsGenerator);
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(SimpleTwinlistControl),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });

  it("optionsGenerator correctly transforms the data", async () => {
    await wrapper.vm.$nextTick();

    expect(
      wrapper.getComponent(AnyOfTwinlist).vm.optionsGenerator(props.control),
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
