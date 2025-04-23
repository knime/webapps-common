import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { VueWrapper, flushPromises, mount } from "@vue/test-utils";

import { FunctionButton, SideDrawer } from "@knime/components";

import { subPanelDestInjectionKey } from "../SettingsSubPanel.vue";

import TestSettingsSubPanel, {
  type Props as TestComponentProps,
  contentId,
  expandButtonId,
} from "./TestSettingsSubPanel.vue";

describe("SettingsSubPanel", () => {
  let props: TestComponentProps,
    onApply: Mock<() => Promise<void>>,
    setSubPanelExpanded: () => void;

  beforeEach(() => {
    onApply = vi.fn();
    setSubPanelExpanded = vi.fn();
    props = {
      onApply,
      settingsSubPanelConfig: {
        hideButtonsWhenExpanded: true,
      },
    };
  });

  const mountTestComponent = () =>
    mount(TestSettingsSubPanel, {
      props,
      global: {
        provide: {
          setSubPanelExpanded,
          [subPanelDestInjectionKey as symbol]: ref("body"),
        },
      },
    });

  const clickExpandButton = (wrapper: VueWrapper<any>) =>
    wrapper.find(`#${expandButtonId}`).trigger("click");
  const findContent = (wrapper: VueWrapper<any>) =>
    wrapper.findComponent(SideDrawer).find(`#${contentId}`);

  it("expands subpanel on expand button click", async () => {
    const wrapper = mountTestComponent();
    expect(findContent(wrapper).exists()).toBeFalsy();
    expect(setSubPanelExpanded).not.toHaveBeenCalled();
    await clickExpandButton(wrapper);
    expect(findContent(wrapper).exists()).toBeTruthy();
    expect(setSubPanelExpanded).toHaveBeenCalledWith({ isExpanded: true });
  });

  it("shows back arrow if desired (and clicking it closes the panel)", async () => {
    props.settingsSubPanelConfig.showBackArrow = true;
    onApply.mockResolvedValue();
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);
    const backButton = wrapper.findComponent(FunctionButton);
    await backButton.trigger("click");
    await flushPromises();
    expect(findContent(wrapper).exists()).toBeFalsy();
  });

  it("doesn't show back button if not desired", async () => {
    props.settingsSubPanelConfig.showBackArrow = false;
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);
    expect(wrapper.findComponent(FunctionButton).exists()).toBeFalsy();
  });
});
