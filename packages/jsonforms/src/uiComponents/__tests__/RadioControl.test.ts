import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { RadioButtons } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import RadioControl from "../RadioControl.vue";
import RadioControlBase from "../RadioControlBase.vue";

describe("RadioControl.vue", () => {
  let props: VueControlTestProps<typeof RadioControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "radioControlLabel";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: "LOG",
        schema: {
          oneOf: [
            {
              const: "LOG",
              title: "Logarithmic",
            },
            {
              const: "VALUE",
              title: "Linear",
            },
          ],
        },
        uischema: {
          type: "Control",
          scope: "#/properties/yAxisScale",
          options: {
            format: "radio",
            radioLayout: "horizontal",
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: false,
    };

    const component = await mountJsonFormsControlLabelContent(RadioControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(RadioButtons).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(RadioButtons).props().id).toBe(labelForId);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(RadioButtons).props().modelValue).toBe("LOG");
  });

  it("tests that component is set correctly to render vertical", async () => {
    props.control.uischema.options!.radioLayout = "vertical";
    const { wrapper: newWrapper } = await mountJsonFormsControlLabelContent(
      RadioControl,
      { props },
    );
    expect(newWrapper.findComponent(RadioButtons).props().alignment).toBe(
      "vertical",
    );
  });

  it("calls changeValue when radio button is changed", () => {
    wrapper.findComponent(RadioButtons).vm.$emit("update:modelValue", "VALUE");
    expect(changeValue).toHaveBeenCalledWith("VALUE");
  });

  it("sets correct possible values", () => {
    expect(
      wrapper.findComponent(RadioButtons).props().possibleValues,
    ).toStrictEqual([
      { id: "LOG", text: "Logarithmic" },
      { id: "VALUE", text: "Linear" },
    ]);
  });

  it("disables individual possible values if desired", async () => {
    props.control.uischema.options!.disabledOptions = "LOG";
    const { wrapper } = await mountJsonFormsControlLabelContent(
      RadioControlBase,
      {
        props,
      },
    );
    expect(
      wrapper.findComponent(RadioButtons).props().possibleValues,
    ).toStrictEqual([
      { id: "LOG", text: "Logarithmic", disabled: true },
      { id: "VALUE", text: "Linear" },
    ]);
  });
});
