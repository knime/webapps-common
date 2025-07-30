import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import { v4 as uuidv4 } from "uuid";

import BaseRadioButtons from "../BaseRadioButtons.vue";

vi.mock("uuid");

describe("BaseRadioButtons", () => {
  const possibleValues = new Array(5).fill(0).map((_, index) => ({
    id: `test${index + 1}`,
    text: `Text ${index + 1}`,
    disabled: false,
  }));

  const firstUUIDReturnValue = new Uint8Array(16);
  const secondUUIDReturnValue = new Uint8Array(16).map((_val, ind) => ind);

  beforeEach(() => {
    vi.mocked(uuidv4)
      .mockReturnValueOnce(firstUUIDReturnValue)
      .mockReturnValueOnce(secondUUIDReturnValue);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

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

    expect(wrapper.find("input").attributes("name")).toBe(
      `RadioButtons-${firstUUIDReturnValue}`,
    );

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

  it("renders a unique name attribute", () => {
    const wrapper1 = mount(BaseRadioButtons, {
      props: { possibleValues },
    }) as VueWrapper<any>;
    const wrapper2 = mount(BaseRadioButtons, {
      props: { possibleValues },
    }) as VueWrapper<any>;

    expect(wrapper1.vm.name).not.toBe(wrapper2.vm.name);
    expect(wrapper1.find("input").attributes().name).not.toBe(
      wrapper2.find("input").attributes().name,
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
