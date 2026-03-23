import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

import {
  type ControlSlots,
  type VueControl,
  type VueControlProps,
  type VueControlRenderer,
  defineControl,
  mapControls,
} from "../..";
import { getControlBase } from "../../../../testUtils";
import DescriptionPopover from "../DescriptionPopover.vue";
import { withDescriptionButton } from "../withDescription";

import TestControlWithButtonsSlot from "./TestControlWithButtonsSlot.vue";

describe("withDescriptionButton", () => {
  let props: VueControlProps<string>;

  const testDescription = "<p>Test description</p>";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        uischema: {
          type: "Control",
          scope: "#/properties/name",
        },
        schema: {
          type: "string",
        },
        data: "test",
        label: "Test Label",
        description: testDescription,
      },
      handleChange: vi.fn(),
      changeValue: vi.fn(),
      disabled: false,
      isValid: true,
      messages: { errors: [] },
      onRegisterValidation: vi.fn(),
    };
  });

  const testControlRenderer: VueControlRenderer = {
    control: TestControlWithButtonsSlot,
    name: "TestControl",
    tester: () => 1,
  };

  const wrappedControlRenderer = {
    ...testControlRenderer,
    control: withDescriptionButton(testControlRenderer.control),
  };

  const mountWrappedControl = () =>
    mount(wrappedControlRenderer.control, {
      props,
    });

  it("passes props to the wrapped control", () => {
    const wrapper = mountWrappedControl();
    expect(wrapper.find(".control-content").text()).toBe("Data: test");
  });

  it("renders DescriptionPopover when description is present", () => {
    const wrapper = mountWrappedControl();
    const popover = wrapper.findComponent(DescriptionPopover);
    expect(popover.exists()).toBeTruthy();
    expect(popover.props()).toMatchObject({
      html: testDescription,
      hover: false,
    });
  });

  it("does not render DescriptionPopover when description is undefined", () => {
    // @ts-expect-error - testing undefined description
    props.control.description = undefined;
    const wrapper = mountWrappedControl();
    const popover = wrapper.findComponent(DescriptionPopover);
    expect(popover.exists()).toBeFalsy();
  });

  it("does not render DescriptionPopover when description is an empty string", () => {
    props.control.description = "";
    const wrapper = mountWrappedControl();
    const popover = wrapper.findComponent(DescriptionPopover);
    expect(popover.exists()).toBeFalsy();
  });

  const Button = defineComponent(() => () => h("div", "Button"), {
    props: {
      hover: Boolean,
    },
  });

  const addButton = (control: VueControl<any>) =>
    defineControl((controlProps) => () => {
      const slots: ControlSlots = {
        buttons: (slotProps) => [h(Button, slotProps as any)],
      };
      return h(control, controlProps, slots);
    });

  it("preserves existing buttons slot content", () => {
    const controlWithButton = addButton(wrappedControlRenderer.control);
    const wrapper = mount(controlWithButton, { props });

    expect(wrapper.findComponent(Button).exists()).toBeTruthy();
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBeTruthy();
  });

  it("passes hover state to DescriptionPopover", async () => {
    const controlWithButton = addButton(wrappedControlRenderer.control);
    const wrapper = mount(controlWithButton, { props });

    expect(wrapper.findComponent(DescriptionPopover).props("hover")).toBe(
      false,
    );
    expect(wrapper.findComponent(Button).props("hover")).toBe(false);

    await wrapper.find(".test-control").trigger("mouseover");

    expect(wrapper.findComponent(DescriptionPopover).props("hover")).toBe(true);
    expect(wrapper.findComponent(Button).props("hover")).toBe(true);
  });

  describe("mapControls integration", () => {
    const controlRenderers = {
      testControlA: {
        control: TestControlWithButtonsSlot,
        name: "TestControlA",
        tester: () => 1,
      } as VueControlRenderer,
      testControlB: {
        control: TestControlWithButtonsSlot,
        name: "TestControlB",
        tester: () => 2,
      } as VueControlRenderer,
    };

    const mappedControls = mapControls(withDescriptionButton)(controlRenderers);

    it("applies withDescriptionButton to all controls in an object", () => {
      expect(Object.keys(mappedControls)).toEqual([
        "testControlA",
        "testControlB",
      ]);

      const wrapperA = mount(mappedControls.testControlA.control, { props });
      const wrapperB = mount(mappedControls.testControlB.control, { props });

      expect(wrapperA.findComponent(DescriptionPopover).exists()).toBeTruthy();
      expect(wrapperB.findComponent(DescriptionPopover).exists()).toBeTruthy();
    });

    it("preserves the name and tester properties of mapped controls", () => {
      expect(mappedControls.testControlA.name).toBe("TestControlA");
      expect(mappedControls.testControlA.tester).toBe(
        controlRenderers.testControlA.tester,
      );
      expect(mappedControls.testControlB.name).toBe("TestControlB");
      expect(mappedControls.testControlB.tester).toBe(
        controlRenderers.testControlB.tester,
      );
    });

    it("each mapped control can render description independently", () => {
      const propsWithDescription = { ...props };
      const propsWithoutDescription = {
        ...props,
        control: { ...props.control, description: undefined },
      };

      const wrapperWithDesc = mount(mappedControls.testControlA.control, {
        props: propsWithDescription,
      });
      const wrapperWithoutDesc = mount(mappedControls.testControlB.control, {
        props: propsWithoutDescription,
      });

      expect(
        wrapperWithDesc.findComponent(DescriptionPopover).exists(),
      ).toBeTruthy();
      expect(
        wrapperWithoutDesc.findComponent(DescriptionPopover).exists(),
      ).toBeFalsy();
    });
  });
});
