import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

import { Label } from "@knime/components";

import {
  type ControlSlots,
  type VueControl,
  type VueControlProps,
  defineControl,
  withLabel,
} from "../..";
import { getControlBase } from "../../../../testUtils";

import TestControlLabelContent from "./TestControlLabelContent.vue";

describe("withLabel", () => {
  let props: VueControlProps<string>;

  const testLabel = "Test Label";

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
        label: testLabel,
      },
      handleChange: vi.fn(),
      changeValue: vi.fn(),
      disabled: false,
      isValid: true,
      messages: { errors: [] },
      onRegisterValidation: vi.fn(),
    };
  });

  const testControlLabelContentRenderer = {
    control: TestControlLabelContent,
    name: "TestControlLabel",
    tester: () => 1,
  };

  const testControlRenderer = withLabel(testControlLabelContentRenderer);

  const mountTestControlRenderer = () =>
    mount(testControlRenderer.control, {
      props,
    });

  const propsWithoutMessages = (props: VueControlProps<string>) => {
    const { messages: _, ...rest } = props;
    return rest;
  };

  it("adds a label to the control", () => {
    const wrapper = mountTestControlRenderer();
    expect(wrapper.findComponent(Label).props()).toMatchObject({
      text: testLabel,
    });
    expect(
      wrapper.findComponent(TestControlLabelContent).props(),
    ).toMatchObject(propsWithoutMessages(props));
  });

  it("sets labelForId", () => {
    const wrapper = mountTestControlRenderer();
    expect(
      wrapper.findComponent(TestControlLabelContent).props().labelForId,
    ).toBeTypeOf("string");
  });

  const Button = defineComponent(() => () => h("div", "Button"), {
    props: {
      hover: Boolean,
    },
  });

  const addButton = (control: VueControl<any>) =>
    defineControl((props) => () => {
      const slots: ControlSlots = {
        buttons: (slotProps) => [h(Button, slotProps as any)],
      };
      return h(control, props, slots);
    });

  it("sets slot prop for buttons", async () => {
    const wrapper = mount(addButton(testControlRenderer.control), {
      props,
    });
    expect(wrapper.findComponent(Button).exists()).toBeTruthy();
    expect(wrapper.findComponent(Button).props()).toMatchObject({
      hover: false,
    });
    await wrapper.findComponent(TestControlLabelContent).trigger("mouseover");
    expect(wrapper.findComponent(Button).props()).toMatchObject({
      hover: true,
    });
  });

  it("does not show the label if hideControlHeader is true", () => {
    props.control.uischema.options = {
      hideControlHeader: true,
    };
    const wrapper = mountTestControlRenderer();
    expect(wrapper.findComponent(Label).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(TestControlLabelContent).props(),
    ).toMatchObject(propsWithoutMessages(props));
  });
});
