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

import { KdsRadioButtonGroup } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import RadioControl from "../RadioControl.vue";

describe("RadioControl", () => {
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
    expect(wrapper.findComponent(KdsRadioButtonGroup).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(KdsRadioButtonGroup).props().id).toBe(
      labelForId,
    );
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(KdsRadioButtonGroup).props().modelValue).toBe(
      "LOG",
    );
  });

  it("tests that component is set correctly to render vertical", async () => {
    props.control.uischema.options!.radioLayout = "vertical";
    const { wrapper: newWrapper } = await mountJsonFormsControlLabelContent(
      RadioControl,
      { props },
    );
    expect(
      newWrapper.findComponent(KdsRadioButtonGroup).props().alignment,
    ).toBe("vertical");
  });

  it("calls changeValue when radio button is changed", () => {
    wrapper
      .findComponent(KdsRadioButtonGroup)
      .vm.$emit("update:model-value", "VALUE");
    expect(changeValue).toHaveBeenCalledWith("VALUE");
  });

  it("sets correct possible values", () => {
    expect(
      wrapper.findComponent(KdsRadioButtonGroup).props().possibleValues,
    ).toStrictEqual([
      { id: "LOG", text: "Logarithmic" },
      { id: "VALUE", text: "Linear" },
    ]);
  });

  it("disables individual possible values from array if desired", async () => {
    props.control.uischema.options!.possibleValues = [
      { id: "LOG", text: "Logarithmic" },
      { id: "VALUE", text: "Linear", disabled: true },
      { id: "OTHER", text: "Other", disabled: false },
    ];
    const { wrapper } = await mountJsonFormsControlLabelContent(RadioControl, {
      props,
    });
    expect(
      wrapper.findComponent(KdsRadioButtonGroup).props().possibleValues,
    ).toStrictEqual([
      { id: "LOG", text: "Logarithmic" },
      { id: "VALUE", text: "Linear", disabled: true },
      { id: "OTHER", text: "Other" },
    ]);
  });

  it("uses possible values", async () => {
    props.control.uischema.options!.possibleValues = [
      { id: "VAL 1", text: "Val 1" },
      { id: "VAL 2", text: "Val 2" },
    ];
    const { wrapper } = await mountJsonFormsControlLabelContent(RadioControl, {
      props,
    });
    expect(
      wrapper.findComponent(KdsRadioButtonGroup).props().possibleValues,
    ).toStrictEqual([
      { id: "VAL 1", text: "Val 1" },
      { id: "VAL 2", text: "Val 2" },
    ]);
  });
});
