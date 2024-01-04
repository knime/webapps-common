import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import RadioInput from "../RadioInput.vue";
import RadioInputBase from "../RadioInputBase.vue";
import LabeledInput from "../label/LabeledInput.vue";
import RadioButtons from "webapps-common/ui/components/forms/RadioButtons.vue";
import BaseRadioButtons from "webapps-common/ui/components/forms/BaseRadioButtons.vue";

describe("RadioInput.vue", () => {
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
    const { wrapper } = await mountJsonFormsComponent(RadioInput, { props });
    expect(wrapper.getComponent(RadioInput).exists()).toBe(true);
    expect(wrapper.getComponent(RadioInputBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(RadioButtons).exists()).toBe(true);
    expect(wrapper.findComponent(BaseRadioButtons).exists()).toBe(true);
  });

  it("sets correct type prop", async () => {
    const { wrapper } = await mountJsonFormsComponent(RadioInput, { props });
    expect(wrapper.findComponent(RadioInputBase).props().type).toBe("radio");
  });

  it("tests that component is set correctly to render vertical", async () => {
    props.control.uischema.options.radioLayout = "vertical";
    const { wrapper } = await mountJsonFormsComponent(RadioInput, { props });
    expect(wrapper.findComponent(RadioInputBase).vm.alignment).toBe("vertical");
  });
});
