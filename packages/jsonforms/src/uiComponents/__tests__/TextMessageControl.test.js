import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { InlineMessage } from "@knime/components";

import { mountJsonFormsComponent } from "../../../test-setup/utils/jsonFormsTestUtils";
import TextMessageControl from "../TextMessageControl.vue";

describe("TextMessageControl.vue", () => {
  let defaultProps, wrapper, component;

  beforeEach(async () => {
    defaultProps = {
      schema: {
        properties: {
          authenticationManagedByText: {
            type: "object",
          },
        },
      },
      uischema: {
        type: "Control",
        scope: "#/properties/view/properties/authenticationManagedByText",
        options: {
          format: "textMessage",
          messageProvider: "someMessageProviderID",
        },
      },
    };

    component = await mountJsonFormsComponent(TextMessageControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(TextMessageControl).exists()).toBeTruthy();
  });

  it("does not render a message when provider returns null", async () => {
    let provideMessage;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideMessage = callback;
    });

    const { wrapper } = mountJsonFormsComponent(TextMessageControl, {
      props: defaultProps,
      provide: { addStateProviderListenerMock },
    });
    provideMessage(null);
    await flushPromises();
    expect(wrapper.findComponent(InlineMessage).exists()).toBeFalsy();
  });

  it("sets correct message from provider", async () => {
    let provideMessage;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideMessage = callback;
    });

    const { wrapper } = mountJsonFormsComponent(TextMessageControl, {
      props: defaultProps,
      provide: { addStateProviderListenerMock },
    });
    provideMessage({
      type: "INFO",
      title: "Info",
      description: "Here is a message that informs the user",
    });
    await flushPromises();
    expect(wrapper.findComponent(InlineMessage).props("variant")).toBe("info");
  });
});
