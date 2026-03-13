import { beforeEach, describe, expect, it } from "vitest";
import { type VueWrapper, mount } from "@vue/test-utils";

import { KdsDropdown } from "@knime/kds-components";

import { type VueControlTestProps } from "../../../../testUtils";
import LoadingDropdown from "../LoadingDropdown.vue";

describe("LoadingDropdown", () => {
  let props: VueControlTestProps<typeof LoadingDropdown>, wrapper: VueWrapper;

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      possibleValues: [
        { id: "first", text: "First" },
        {
          id: "second",
          text: "Second",
          type: { id: "secondType", text: "Second Type" },
        },
        {
          id: "third",
          text: "Third",
          type: { id: "thirdType", text: "Third Type" },
        },
      ],
      modelValue: "first",
      id: labelForId,
      disabled: false,
      ariaLabel: "defaultLabel",
    };

    wrapper = mount(LoadingDropdown, {
      props,
    });
  });

  it("passes mapped options to KdsDropdown", () => {
    expect(wrapper.findComponent(KdsDropdown).props("possibleValues")).toEqual([
      {
        id: "first",
        text: "First",
        disabled: undefined,
        accessory: { type: "dataType", name: "missing_type" },
      },
      {
        id: "second",
        text: "Second",
        disabled: undefined,
        accessory: { type: "dataType", name: "secondType" },
      },
      {
        id: "third",
        text: "Third",
        disabled: undefined,
        accessory: { type: "dataType", name: "thirdType" },
      },
    ]);
  });

  it("does not map accessory when values are not partially typed", async () => {
    await wrapper.setProps({
      possibleValues: [
        { id: "first", text: "First" },
        { id: "second", text: "Second" },
      ],
    });

    expect(wrapper.findComponent(KdsDropdown).props("possibleValues")).toEqual([
      {
        id: "first",
        text: "First",
        disabled: undefined,
        accessory: undefined,
      },
      {
        id: "second",
        text: "Second",
        disabled: undefined,
        accessory: undefined,
      },
    ]);
  });

  it("considers disabled item state", async () => {
    await wrapper.setProps({
      possibleValues: [
        { id: "first", text: "First" },
        {
          id: "second",
          text: "Second",
          disabled: true,
          type: { id: "secondType", text: "Second Type" },
        },
      ],
    });

    const possibleValues = wrapper
      .findComponent(KdsDropdown)
      .props("possibleValues");
    expect(possibleValues[1]).toMatchObject({ disabled: true });
  });

  it("uses loading state when possible values are null", async () => {
    await wrapper.setProps({
      possibleValues: null,
    });

    const dropdown = wrapper.findComponent(KdsDropdown);
    expect(dropdown.props("loading")).toBe(true);
    expect(dropdown.props("placeholder")).toBe("Loading");
    expect(dropdown.props("modelValue")).toBe("");
  });

  it("uses no values placeholder when list is empty", async () => {
    await wrapper.setProps({
      possibleValues: [],
    });

    const dropdown = wrapper.findComponent(KdsDropdown);
    expect(dropdown.props("placeholder")).toBe("No values present");
    expect(dropdown.props("disabled")).toBe(true);
  });

  it("forwards update:modelValue from KdsDropdown", () => {
    wrapper.findComponent(KdsDropdown).vm.$emit("update:modelValue", "second");

    expect(wrapper.emitted("update:modelValue")).toEqual([["second"]]);
  });

  it("maps null update:modelValue to empty string", () => {
    wrapper.findComponent(KdsDropdown).vm.$emit("update:modelValue", null);

    expect(wrapper.emitted("update:modelValue")).toEqual([[""]]);
  });
});
