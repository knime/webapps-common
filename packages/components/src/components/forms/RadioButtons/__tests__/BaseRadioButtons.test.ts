import { describe, expect, it } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";

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

    expect(wrapper.find("input").attributes("name")).toBe("RadioButtons-v-0");

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
    const wrapper = mount({
      template: `
        <div>
          <BaseRadioButtons :possibleValues="possibleValues" />
          <BaseRadioButtons :possibleValues="possibleValues" />
        </div>
      `,
      components: {
        BaseRadioButtons,
      },
      data() {
        return {
          possibleValues,
        };
      },
    }) as VueWrapper<any>;

    const radioButtons = wrapper.findAllComponents(BaseRadioButtons);
    expect(radioButtons[0].props().name).not.toBe(radioButtons[1].props());
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

      expect((radioInputs[i].element as HTMLInputElement).checked).toBe(
        expectedCheckedValue,
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

  it("displays subtext below option", () => {
    const possibleValuesWithSubtext = possibleValues.map(
      (possibleValue, index) => ({
        ...possibleValue,
        subtext: `Subtext ${index + 1}`,
      }),
    );
    const wrapper = mount(BaseRadioButtons, {
      props: {
        possibleValues: possibleValuesWithSubtext,
      },
    });
    const labels = wrapper.findAll("label");
    expect(labels.length).toBe(5);
    labels.forEach((label, index) => {
      expect(label.find("br").exists()).toBeTruthy();
      expect(label.text()).toContain(`Subtext ${index + 1}`);
    });
  });
});
