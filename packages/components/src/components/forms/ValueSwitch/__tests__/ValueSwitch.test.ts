import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import BaseRadioButtons from "../../RadioButtons/BaseRadioButtons.vue";
import ValueSwitch from "../ValueSwitch.vue";

describe("ValueSwitch", () => {
  const possibleValues = new Array(3).fill(0).map((_, index) => ({
    id: `test${index + 1}`,
    text: `Text ${index + 1}`,
    disabled: false,
  }));

  it("renders and passes props to BaseRadioButtons", () => {
    const modelValue = "test3";
    const wrapper = mount(ValueSwitch, {
      props: {
        possibleValues,
        modelValue,
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    const baseComponent = wrapper.findComponent(BaseRadioButtons);
    expect(baseComponent.props("possibleValues")).toStrictEqual(possibleValues);
    expect(baseComponent.props("modelValue")).toBe(modelValue);
  });

  it("applies variant class", async () => {
    const wrapper = mount(ValueSwitch, {
      props: {
        possibleValues,
      },
    });

    expect(wrapper.classes()).toContain("normal");

    await wrapper.setProps({ compact: true });

    expect(wrapper.classes()).toContain("compact");
  });
});
