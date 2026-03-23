import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import { Description } from "@knime/components";
import { KdsInfoToggleButton } from "@knime/kds-components";

import DescriptionPopover, {
  type DescriptionPopoverProps,
} from "../DescriptionPopover.vue";

describe("DescriptionPopover.vue", () => {
  const mountDescriptionPopover = (props: DescriptionPopoverProps = {}) => {
    return mount(DescriptionPopover, { props });
  };

  it("renders KdsInfoToggleButton with correct props", () => {
    const wrapper = mountDescriptionPopover();

    const toggleButton = wrapper.findComponent(KdsInfoToggleButton);
    expect(toggleButton.exists()).toBeTruthy();
    expect(toggleButton.props("hidden")).toBe(true);
  });

  it("sets hidden to false when hover is true", () => {
    const wrapper = mountDescriptionPopover({ hover: true });

    const toggleButton = wrapper.findComponent(KdsInfoToggleButton);
    expect(toggleButton.props("hidden")).toBe(false);
  });

  it("renders Description with html content in the slot after clicking", async () => {
    const html = "<h1>My html content</h1>";
    const wrapper = mountDescriptionPopover({ html });

    await wrapper.find("button").trigger("click");

    const description = wrapper.findComponent(Description);
    expect(description.exists()).toBeTruthy();
    expect(description.props()).toMatchObject({
      text: html,
      renderAsHtml: true,
    });
  });

  it("renders Description with null text when no html is provided", async () => {
    const wrapper = mountDescriptionPopover();

    await wrapper.find("button").trigger("click");

    const description = wrapper.findComponent(Description);
    expect(description.exists()).toBeTruthy();
    expect(description.props("text")).toBeNull();
    expect(description.props("renderAsHtml")).toBe(true);
  });
});
