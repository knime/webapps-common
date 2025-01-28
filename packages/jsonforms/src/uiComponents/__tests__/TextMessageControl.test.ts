import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { InlineMessage } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import TextMessageControl from "../TextMessageControl.vue";

describe("TextMessageControl.vue", () => {
  let props: VueControlTestProps<typeof TextMessageControl>;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: undefined,
        schema: {},
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/authenticationManagedByText",
          options: {
            format: "textMessage",
            messageProvider: "someMessageProviderID",
          },
        },
      },
      disabled: false,
      isValid: false,
      messages: { errors: [] },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not render a message when provider returns null", async () => {
    let provideMessage: (message: any) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideMessage = callback;
    });

    const { wrapper } = mountJsonFormsControl(TextMessageControl, {
      props,
      provide: { addStateProviderListener },
    });
    provideMessage!(null);
    await flushPromises();
    expect(wrapper.findComponent(InlineMessage).exists()).toBeFalsy();
  });

  it("sets correct message from provider", async () => {
    let provideMessage: (message: any) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideMessage = callback;
    });

    const { wrapper } = mountJsonFormsControl(TextMessageControl, {
      props,
      provide: { addStateProviderListener },
    });
    provideMessage!({
      type: "INFO",
      title: "Info",
      description: "Here is a message that informs the user",
    });
    await flushPromises();
    expect(wrapper.findComponent(InlineMessage).props("variant")).toBe("info");
  });
});
