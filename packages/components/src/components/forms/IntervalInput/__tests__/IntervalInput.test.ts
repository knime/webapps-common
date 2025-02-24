import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";

import NumberInput from "../../NumberInput/NumberInput.vue";
import ValueSwitch from "../../ValueSwitch/ValueSwitch.vue";
import IntervalInput from "../IntervalInput.vue";

const defaultProps: Partial<InstanceType<typeof IntervalInput>["$props"]> = {
  format: "DATE",
  disabled: false,
  compact: false,
  modelValue: "P1Y2M3W4D",
};

const doMount = async (
  args: {
    props?: Partial<InstanceType<typeof IntervalInput>["$props"]>;
    showPopup?: boolean;
  } = {
    props: defaultProps,
    showPopup: false,
  },
) => {
  const component = mount(IntervalInput, {
    // @ts-ignore
    props: args.props,
    attachTo: "body",
  });

  if (args.showPopup) {
    await component.find(".trigger-popover-button").trigger("click");
    await nextTick();
  }

  return {
    wrapper: component,
  };
};

describe("IntervalInput", () => {
  it("should render", async () => {
    const { wrapper } = await doMount();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should show the correct value initially", async () => {
    const { wrapper } = await doMount();

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    expect(textField.value).toBe("1 year 2 months 3 weeks 4 days");
  });

  it("should initially have the popup hidden", async () => {
    const { wrapper } = await doMount();

    const popup = wrapper.find(".control-popup");
    expect(popup.exists() && popup.isVisible()).toBeFalsy();
  });

  it("should show popup when clicking the button", async () => {
    const { wrapper } = await doMount();

    const button = wrapper.find(".trigger-popover-button");
    await button.trigger("click");
    await nextTick();

    const popup = wrapper.find(".control-popup");
    expect(popup.isVisible()).toBeTruthy();
  });

  it("should hide popup when clicking the button again", async () => {
    const { wrapper } = await doMount({ showPopup: true, props: defaultProps });

    const button = wrapper.find(".trigger-popover-button");
    await button.trigger("click");
    await nextTick();

    const popup = wrapper.find(".control-popup");
    expect(popup.isVisible()).toBeFalsy();
  });

  it("should hide popup when clicking outside", async () => {
    const { wrapper } = await doMount({ showPopup: true, props: defaultProps });

    await wrapper.trigger("click");
    await nextTick();

    const popup = wrapper.find(".control-popup");
    expect(popup.isVisible()).toBeFalsy();
  });

  it("should hide popup when clicking accept button", async () => {
    const { wrapper } = await doMount({ showPopup: true, props: defaultProps });

    const acceptButton = wrapper.find(".accept-controls button");
    await acceptButton.trigger("click");
    await nextTick();

    const popup = wrapper.find(".control-popup");
    expect(popup.isVisible()).toBeFalsy();
  });

  it("should commit popup values when clicking accept button", async () => {
    const { wrapper } = await doMount({ showPopup: true, props: defaultProps });

    // let's set all number inputs to 3...
    const numberInputs = wrapper.findAllComponents(NumberInput);
    numberInputs.forEach((numberInput) => {
      numberInput.vm.$emit("update:modelValue", 3);
    });

    const acceptButton = wrapper.find(".accept-controls button");
    await acceptButton.trigger("click");
    await nextTick();

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    expect(textField.value).toBe("3 years 3 months 3 weeks 3 days");
  });

  it("should give a negative human-readable string when in descending mode and clicking accept", async () => {
    const { wrapper } = await doMount({
      props: defaultProps,
      showPopup: true,
    });

    const descendingToggle = wrapper
      .find(".ascending-descending-switch-container")
      .findComponent(ValueSwitch);
    descendingToggle.vm.$emit("update:modelValue", "DESCENDING");

    await nextTick();

    const acceptButton = wrapper.find(".accept-controls button");
    await acceptButton.trigger("click");

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    expect(textField.value).toBe("-(1 year 2 months 3 weeks 4 days)");
  });

  it("should make the input disabled when disabled prop is true", async () => {
    const { wrapper } = await doMount({
      props: { ...defaultProps, disabled: true },
    });

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    expect(textField.disabled).toBeTruthy();
  });

  it("shouldn't have a date/time toggle switch when format is not DATE_TIME", async () => {
    const { wrapper } = await doMount({
      props: defaultProps,
      showPopup: true,
    });

    const dateToggle = wrapper.find(".header").findComponent(ValueSwitch);
    expect(dateToggle.exists()).toBeFalsy();
  });

  it("should have a date/time toggle switch when format is DATE_TIME", async () => {
    const { wrapper } = await doMount({
      props: { ...defaultProps, format: "DATE_OR_TIME" },
      showPopup: true,
    });

    const dateToggle = wrapper.find(".header").findComponent(ValueSwitch);
    expect(dateToggle.exists()).toBeTruthy();
  });

  it("should update the format when toggling the date/time switch", async () => {
    const { wrapper } = await doMount({
      props: { ...defaultProps, format: "DATE_OR_TIME" },
      showPopup: true,
    });

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    expect(textField.value).toBe("1 year 2 months 3 weeks 4 days");

    const dateToggle = wrapper.find(".header").findComponent(ValueSwitch);
    dateToggle.vm.$emit("update:modelValue", "TIME");

    const acceptButton = wrapper.find(".accept-controls button");
    await acceptButton.trigger("click");

    expect(textField.value).toBe("1 second");
  });

  it("input field should accept human-readable durations and reformat them", async () => {
    const { wrapper } = await doMount();

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    textField.value = "15 years";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value).toBe("15 years");

    // also works with negative durations with default props
    textField.value = "-(1 y 2 months 3w 4 day)";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value).toBe("-(1 year 2 months 3 weeks 4 days)");
  });

  it("input field should not reformat invalid human-readable durations", async () => {
    const { wrapper } = await doMount({
      props: { ...defaultProps, allowDescending: false },
    });

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    textField.value = "definitely not a valid duration";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value).toBe("definitely not a valid duration");

    // NaN durations are also invalid!
    textField.value = "";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value, "empty durations are also invalid").toBe("");

    // And negative durations are invalid if we have set the appropriate prop, which we have
    textField.value = "-(1d)";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value, "negative durations are invalid").toBe("-(1d)");

    // Since we're in DATE mode, we can't have time durations
    textField.value = "1h";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value, "time durations are invalid").toBe("1h");
  });

  it("should change the format when in DATE_OR_TIME mode and new human readable durations are entered", async () => {
    const { wrapper } = await doMount({
      props: { ...defaultProps, format: "DATE_OR_TIME" },
    });

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    expect(textField.value).toBe("1 year 2 months 3 weeks 4 days");

    textField.value = "42h";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value).toBe("42 hours");

    // also switch back just in case
    textField.value = "-15 years";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value).toBe("-(15 years)");
  });

  it("should reformat input text durations to their canonical format", async () => {
    const { wrapper } = await doMount();

    const textField = wrapper.find("input[type='text']")
      .element as HTMLInputElement;

    textField.value = "P94W";
    textField.dispatchEvent(new Event("input"));
    textField.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));

    await nextTick();

    expect(textField.value).toBe("94 weeks");
  });
});
