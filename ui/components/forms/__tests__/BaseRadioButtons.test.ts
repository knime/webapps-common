import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import BaseRadioButtons from "../BaseRadioButtons.vue";

describe("BaseRadioButtons.vue", () => {
  const possibleValues = new Array(5).fill(0).map((_, index) => ({
    id: `test${index + 1}`,
    text: `Text ${index + 1}`,
    disabled: false,
  }));

  it("renders", () => {
    const wrapper = mount(BaseRadioButtons, {
      props: {
        possibleValues,
      },
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();

    const labels = wrapper.findAll("label");
    expect(labels.length).toBe(possibleValues.length);
    possibleValues.forEach((value, i) => {
      expect(labels[i].text()).toContain(value.text);
    });
  });

  it("renders a name value", () => {
    const value = "test3";
    let wrapper = mount(BaseRadioButtons, {
      props: {
        possibleValues,
        value,
      },
    });

    // right now depends on the position of the test
    expect(wrapper.find("input").attributes("name")).toBe("wc-radio-2");

    wrapper = mount(BaseRadioButtons, {
      props: {
        possibleValues,
        value,
        name: "custom-name",
      },
    });
    expect(wrapper.find("input").attributes("name")).toBe("custom-name");
  });

  it("renders when possibleValues is empty", () => {
    expect(mount(BaseRadioButtons).html()).toBeTruthy();
  });

  it("renders unique name attributes", () => {
    const wrapper1 = mount(BaseRadioButtons, {
      props: {
        possibleValues,
      },
    });
    const wrapper2 = mount(BaseRadioButtons, {
      props: {
        possibleValues,
      },
    });

    expect(wrapper1.vm.count).not.toBe(wrapper2.vm.count);
    expect(wrapper1.find("input").attributes().name).not.toBe(
      wrapper2.find("input").attributes().name
    );
  });

  it("renders selected value", () => {
    const modelValue = "test3";
    const wrapper = mount(BaseRadioButtons, {
      props: {
        possibleValues,
        modelValue,
      },
    });

    const radioInputs = wrapper.findAll("input[type=radio]");
    possibleValues.forEach((option, i) => {
      const expectedCheckedValue = option.id === modelValue;
      // eslint-disable-next-line no-extra-parens
      expect((radioInputs[i].element as HTMLInputElement).checked).toBe(
        expectedCheckedValue
      );
    });
  });

  it("emits event for selected value", () => {
    const wrapper = mount(BaseRadioButtons, {
      props: {
        possibleValues,
      },
    });
    const newValue = "test2";
    const input = wrapper.find(`input[value=${newValue}]`);
    input.setValue(newValue);
    expect(wrapper.emitted("update:modelValue")![0][0]).toEqual(newValue);
  });

  it("validates possibleValues", () => {
    const validator = BaseRadioButtons.props.possibleValues.validator;
    expect(validator("str")).toBe(false);
    expect(validator(possibleValues)).toBe(true);
  });

  it("disables individual items", () => {
    const wrapper = mount(BaseRadioButtons, {
      props: {
        possibleValues: possibleValues.concat({
          id: "test6",
          text: "Text 6",
          disabled: true,
        }),
      },
    });

    const input = wrapper.find("input[value=test6]");
    expect(input.attributes("disabled")).toBeDefined();
  });
});
