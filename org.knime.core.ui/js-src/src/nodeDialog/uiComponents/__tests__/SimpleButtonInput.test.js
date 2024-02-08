import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import SimpleButtonInput from "../SimpleButtonInput.vue";

describe("SimpleButtonInput.vue", () => {
  let defaultProps, wrapper, component;

  const triggerId = "myTriggerId";
  const buttonText = "myText";

  let triggerMock;

  beforeEach(async () => {
    triggerMock = vi.fn();
    defaultProps = {
      control: {
        ...getControlBase("path"),
        schema: {
          properties: {
            button: {
              type: "object",
              title: "Button",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/button",
          options: {
            format: "simpleButton",
            triggerId,
            text: buttonText,
          },
        },
      },
    };
    component = await mountJsonFormsComponent(SimpleButtonInput, {
      props: defaultProps,
      provide: { triggerMock },
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders button with text", () => {
    expect(wrapper.find("button.button-input").text()).toBe(buttonText);
  });

  it("calls provided trigger method when the button is clicked", async () => {
    await wrapper.find("button.button-input").trigger("click");
    expect(triggerMock).toHaveBeenCalledWith(triggerId);
  });
});
