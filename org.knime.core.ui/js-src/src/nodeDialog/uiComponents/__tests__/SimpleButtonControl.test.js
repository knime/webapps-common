import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import ReloadIcon from "@knime/styles/img/icons/reload.svg";
import SimpleButtonControl from "../SimpleButtonControl.vue";
import { Button } from "@knime/components";

describe("SimpleButtonControl.vue", () => {
  let props, wrapper, component;

  const triggerId = "myTriggerId";
  const buttonText = "myText";

  let triggerMock;

  beforeEach(async () => {
    triggerMock = vi.fn();
    props = {
      control: {
        ...getControlBase("path"),
        label: buttonText,
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
    };
    component = await mountJsonFormsComponent(SimpleButtonControl, {
      props,
      provide: { triggerMock },
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
    expect(triggerMock).toHaveBeenCalledWith({ id: triggerId });
  });

  it("shows icon defined by the options if desired", async () => {
    props.control.uischema.options.icon = "reload";
    const { wrapper } = await mountJsonFormsComponent(SimpleButtonControl, {
      props,
    });
    expect(
      wrapper.findComponent(Button).findComponent(ReloadIcon).exists(),
    ).toBeTruthy();
  });
});
