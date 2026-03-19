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

import { KdsButton } from "@knime/kds-components";

import { getControlBase, mountJsonFormsControl } from "../../../testUtils";
import type { VueControlProps } from "../../higherOrderComponents";
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
    expect(wrapper.findComponent(KdsButton).props("label")).toBe(buttonText);
  });

  it("calls provided trigger method when the button is clicked", async () => {
    await wrapper.findComponent(KdsButton).trigger("click");
    expect(trigger).toHaveBeenCalledWith({ id: triggerId });
  });

  it("shows icon defined by the options if desired", async () => {
    props.control.uischema.options!.icon = "reload";
    const { wrapper } = await mountJsonFormsControl(SimpleButtonControl, {
      props,
    });
    expect(wrapper.findComponent(KdsButton).props("leadingIcon")).toBe(
      "reload",
    );
  });

  it("disables button on click if 'runFinished' provided option is used", async () => {
    props.control.uischema.providedOptions = ["runFinished"];
    const { wrapper } = await mountJsonFormsControl(SimpleButtonControl, {
      props,
      provide: { trigger },
    });

    const button = wrapper.findComponent(KdsButton);
    expect(button.props("disabled")).toBe(false);

    await button.trigger("click");
    expect(button.props("disabled")).toBe(true);
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

    const button = wrapper.findComponent(KdsButton);
    expect(button.props("disabled")).toBe(false);

    await button.trigger("click");
    expect(button.props("disabled")).toBe(true);

    // Simulate update of runFinished uuid via state provider
    provideRunFinished!("new-uuid");
    await nextTick();

    expect(button.props("disabled")).toBe(false);
  });
});
