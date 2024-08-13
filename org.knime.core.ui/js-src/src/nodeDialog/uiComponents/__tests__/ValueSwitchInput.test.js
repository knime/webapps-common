import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import RadioInputBase from "../RadioInputBase.vue";
import ValueSwitchInput from "../ValueSwitchInput.vue";
import LabeledInput from "../label/LabeledInput.vue";
import { ValueSwitch } from "@knime/components";

describe("ValueSwitchInput.vue", () => {
  const defaultProps = {
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
          format: "valueSwitch",
        },
      },
    },
  };

  let wrapper;

  beforeEach(async () => {
    const component = await mountJsonFormsComponent(ValueSwitchInput, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ValueSwitchInput).exists()).toBe(true);
    expect(wrapper.getComponent(RadioInputBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(ValueSwitch).exists()).toBe(true);
  });

  it("sets correct type prop", () => {
    expect(wrapper.findComponent(RadioInputBase).props().type).toBe(
      "valueSwitch",
    );
  });
});
