import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ValueSwitch } from "@knime/components";

import {
  getControlBase,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import RadioControlBase from "../RadioControlBase.vue";
import ValueSwitchControl from "../ValueSwitchControl.vue";
import LabeledControl from "../label/LabeledControl.vue";

describe("ValueSwitchControl.vue", () => {
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
    const component = await mountJsonFormsComponent(ValueSwitchControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ValueSwitchControl).exists()).toBe(true);
    expect(wrapper.getComponent(RadioControlBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(ValueSwitch).exists()).toBe(true);
  });

  it("sets correct type prop", () => {
    expect(wrapper.findComponent(RadioControlBase).props().type).toBe(
      "valueSwitch",
    );
  });
});
