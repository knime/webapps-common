import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RadioButtons } from "@knime/components";

import {
  getControlBase,
  mountJsonFormsComponent,
} from "../../../test-setup/utils/jsonFormsTestUtils";
import RadioControl from "../RadioControl.vue";
import RadioControlBase from "../RadioControlBase.vue";
import LabeledControl from "../label/LabeledControl.vue";

describe("RadioControl.vue", () => {
  let props;

  beforeEach(() => {
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
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const { wrapper } = await mountJsonFormsComponent(RadioControl, { props });
    expect(wrapper.getComponent(RadioControl).exists()).toBe(true);
    expect(wrapper.getComponent(RadioControlBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(RadioButtons).exists()).toBe(true);
  });

  it("sets correct type prop", async () => {
    const { wrapper } = await mountJsonFormsComponent(RadioControl, { props });
    expect(wrapper.findComponent(RadioControlBase).props().type).toBe("radio");
  });

  it("tests that component is set correctly to render vertical", async () => {
    props.control.uischema.options.radioLayout = "vertical";
    const { wrapper } = await mountJsonFormsComponent(RadioControl, { props });
    expect(wrapper.findComponent(RadioControlBase).vm.alignment).toBe(
      "vertical",
    );
  });
});
