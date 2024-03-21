import { beforeEach, describe, it, vi, expect, type Mock } from "vitest";
import TestSettingsSubPanel, {
  contentId,
  expandButtonId,
  type Props as TestComponentProps,
} from "./TestSettingsSubPanel.vue";
import { VueWrapper, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import Button from "webapps-common/ui/components/Button.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";

describe("SettingsSubPanel", () => {
  let props: TestComponentProps,
    onApply: Mock<[], Promise<void>>,
    setSubPanelExpanded: () => void;

  beforeEach(() => {
    onApply = vi.fn();
    setSubPanelExpanded = vi.fn();
    props = {
      onApply,
      settingsSubPanelConfig: {},
    };
  });

  const mountTestComponent = () =>
    mount(TestSettingsSubPanel, {
      props,
      global: {
        provide: {
          setSubPanelExpanded,
        },
      },
    });

  const clickExpandButton = (wrapper: VueWrapper<any>) =>
    wrapper.find(`#${expandButtonId}`).trigger("click");
  const findContent = (wrapper: VueWrapper<any>) =>
    wrapper.find(`#${contentId}`);
  const findButtonByText = (text: string) => (wrapper: VueWrapper<any>) =>
    wrapper
      .findAllComponents(Button)
      .filter((wrapper) => wrapper.text() === text)[0];

  it("expands subpanel on expand button click", async () => {
    const wrapper = mountTestComponent();
    expect(findContent(wrapper).exists()).toBeFalsy();
    expect(setSubPanelExpanded).not.toHaveBeenCalled();
    await clickExpandButton(wrapper);
    expect(findContent(wrapper).exists()).toBeTruthy();
    expect(setSubPanelExpanded).toHaveBeenCalledWith({ isExpanded: true });
  });

  it("closes subpanel on cancel", async () => {
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);

    const cancelButton = findButtonByText("Cancel")(wrapper);
    await cancelButton.trigger("click");

    expect(findContent(wrapper).exists()).toBeFalsy();
    expect(setSubPanelExpanded).toHaveBeenCalledWith({ isExpanded: false });
  });

  it("applies and closes subpanel on apply", async () => {
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);
    onApply.mockResolvedValue();
    const applyButton = findButtonByText("Apply")(wrapper);
    await applyButton.trigger("click");
    await flushPromises();
    expect(findContent(wrapper).exists()).toBeFalsy();
  });

  it("does not close the subpanel on an erroneous apply", async () => {
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);
    onApply.mockRejectedValue("Rejected");
    const applyButton = findButtonByText("Apply")(wrapper);
    await applyButton.trigger("click");
    await flushPromises();
    expect(findContent(wrapper).exists()).toBeTruthy();
  });

  it("disables the apply button", async () => {
    props.settingsSubPanelConfig.applyDisabled = true;
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);
    const applyButton = findButtonByText("Apply")(wrapper);
    expect(applyButton.props().disabled).toBeTruthy();
  });

  it("sets the apply button text", async () => {
    const applyText = "My Apply";
    props.settingsSubPanelConfig.applyText = applyText;
    onApply.mockResolvedValue();
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);
    const applyButton = findButtonByText(applyText)(wrapper);
    await applyButton.trigger("click");
    await flushPromises();
    expect(findContent(wrapper).exists()).toBeFalsy();
  });

  it("shows back arrow if desired", async () => {
    props.settingsSubPanelConfig.showBackArrow = true;
    onApply.mockResolvedValue();
    const wrapper = mountTestComponent();
    await clickExpandButton(wrapper);
    const backButton = wrapper.findComponent(FunctionButton);
    await backButton.trigger("click");
    await flushPromises();
    expect(findContent(wrapper).exists()).toBeFalsy();
  });
});
