import { describe, it, expect, beforeEach } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";

import Checkboxes from "./Checkboxes.vue";
import Checkbox from "../Checkbox/Checkbox.vue";

describe("Checkboxes.vue", () => {
  let props;

  beforeEach(() => {
    props = {
      possibleValues: [
        {
          id: "test1",
          text: "test1",
        },
        {
          id: "test2",
          text: "test2",
        },
        {
          id: "test3",
          text: "test3",
        },
      ],
    };
  });

  it("renders", () => {
    const wrapper = mount(Checkboxes, {
      props,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    let checkboxes = wrapper.findAllComponents(Checkbox);
    props.possibleValues.forEach((value, i) => {
      expect(checkboxes[i].text()).toContain(value.text);
    });
    expect(checkboxes.length).toBe(props.possibleValues.length);
  });

  it("sets the values to the checked value", () => {
    const wrapper = mount(Checkboxes, {
      props: {
        ...props,
        modelValue: ["test1"],
      },
    });
    // current value
    expect(wrapper.findAllComponents(Checkbox)[0].props("modelValue")).toBe(
      true,
    );
    expect(wrapper.vm.hasSelection()).toBe(true);

    let checkboxTest2 = wrapper.findAllComponents(Checkbox)[1];

    // check the Checkbox 'test2'
    checkboxTest2.vm.onInput({ target: { checked: true } });
    expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
      "test1",
      "test2",
    ]);

    // test uncheck 'test2'
    checkboxTest2.vm.onInput({ target: { checked: false } });
    expect(wrapper.emitted("update:modelValue")[1][0]).toStrictEqual(["test1"]);
  });

  it("provides a valid hasSelection method", async () => {
    const wrapper = mount(Checkboxes, {
      props,
    });
    expect(wrapper.vm.hasSelection()).toBe(false);

    await wrapper.setProps({ modelValue: ["test1"] });
    expect(wrapper.vm.hasSelection()).toBe(true);
  });

  it("validation of possibleValues", () => {
    const wrapper = shallowMount(Checkboxes);

    const propPossibleValues = wrapper.vm.$options.props.possibleValues;
    expect(
      propPossibleValues.validator && propPossibleValues.validator("str"),
    ).toBeFalsy();
    expect(
      propPossibleValues.validator && propPossibleValues.validator([]),
    ).toBeTruthy();
  });

  it("disables checkboxes if desired", () => {
    props.disabled = true;
    const wrapper = mount(Checkboxes, {
      props,
    });
    wrapper.findAllComponents(Checkbox).forEach((checkbox) => {
      expect(checkbox.props().disabled).toBeTruthy();
    });
  });
});
