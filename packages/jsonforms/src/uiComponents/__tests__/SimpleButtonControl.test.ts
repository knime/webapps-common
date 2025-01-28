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

import { Button } from "@knime/components";
import ReloadIcon from "@knime/styles/img/icons/reload.svg";

import {
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import type { VueControlProps } from "../../higherOrderComponents/control/types";
import SimpleButtonControl from "../SimpleButtonControl.vue";

describe("SimpleButtonControl.vue", () => {
  let props: Omit<VueControlProps<undefined>, "handleChange" | "changeValue">,
    wrapper: VueWrapper,
    trigger: Mock;

  const triggerId = "myTriggerId";
  const buttonText = "myText";

  beforeEach(async () => {
    trigger = vi.fn();
    props = {
      control: {
        ...getControlBase("path"),
        label: buttonText,
        data: undefined,
        schema: {
          properties: {
            button: {
              type: "object",
              title: buttonText,
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/button",
          options: {
            format: "simpleButton",
            triggerId,
          },
        },
      },
      disabled: false,
      isValid: false,
      messages: { errors: [] },
    };
    const component = await mountJsonFormsControl(SimpleButtonControl, {
      props,
      provide: { trigger },
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders button with text", () => {
    expect(wrapper.findComponent(Button).text()).toBe(buttonText);
  });

  it("calls provided trigger method when the button is clicked", async () => {
    await wrapper.findComponent(Button).trigger("click");
    expect(trigger).toHaveBeenCalledWith({ id: triggerId });
  });

  it("shows icon defined by the options if desired", async () => {
    props.control.uischema.options!.icon = "reload";
    const { wrapper } = await mountJsonFormsControl(SimpleButtonControl, {
      props,
    });
    expect(
      wrapper.findComponent(Button).findComponent(ReloadIcon).exists(),
    ).toBeTruthy();
  });
});
