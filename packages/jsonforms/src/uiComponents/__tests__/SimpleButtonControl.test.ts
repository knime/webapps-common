import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";

import { Button } from "@knime/components";
import ReloadIcon from "@knime/styles/img/icons/reload.svg";

import {
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import type { VueControlProps } from "../../higherOrderComponents/control/types";
import SimpleButtonControl from "../SimpleButtonControl.vue";

describe("SimpleButtonControl", () => {
  let props: Omit<
      VueControlProps<undefined>,
      "handleChange" | "changeValue" | "onRegisterValidation"
    >,
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

  it("disables button on click if 'runFinished' provided option is used", async () => {
    props.control.uischema.providedOptions = ["runFinished"];
    const { wrapper } = await mountJsonFormsControl(SimpleButtonControl, {
      props,
      provide: { trigger },
    });

    const button = wrapper.findComponent(Button);
    expect(button.attributes("disabled")).toBeUndefined();

    await button.trigger("click");
    expect(button.attributes("disabled")).toBe("");
  });

  it("enables button again when 'runFinished' uuid is updated", async () => {
    props.control.uischema.providedOptions = ["runFinished"];

    let provideRunFinished: (value: string) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideRunFinished = callback;
    });
    const { wrapper } = await mountJsonFormsControl(SimpleButtonControl, {
      props,
      provide: { trigger, addStateProviderListener },
    });

    const button = wrapper.findComponent(Button);
    expect(button.attributes("disabled")).toBeUndefined();

    await button.trigger("click");
    expect(button.attributes("disabled")).toBe("");

    // Simulate update of runFinished uuid via state provider
    provideRunFinished!("new-uuid");
    await nextTick();

    expect(button.attributes("disabled")).toBeUndefined();
  });
});
