import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import LabeledInput from "../LabeledInput.vue";
import ErrorMessage from "../ErrorMessage.vue";
import FlowVariableButton from "../flowVariables/FlowVariableButton.vue";
import DescriptionPopover from "../description/DescriptionPopover.vue";
import ReexecutionIcon from "webapps-common/ui/assets/img/icons/reexecution.svg";

describe("LabeledInput.vue", () => {
  let props;

  beforeEach(() => {
    props = {
      configKeys: ["myConfigKey"],
      path: "path.to.setting",
      subConfigKeys: ["mySubConfigKey"],
      flowSettings: {
        controllingFlowVariableName: "controlling",
        controllingFlowVariableAvailable: true,
        exposedFlowVariableName: "exposed",
      },
      flowVariablesMap: {},
    };
  });

  it("renders", () => {
    const wrapper = mount(LabeledInput, { props });
    expect(wrapper.getComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(ErrorMessage).exists()).toBe(true);
    const icon = wrapper.findComponent(ReexecutionIcon);
    expect(icon.exists()).toBe(false);
  });

  it("visually displays model settings", () => {
    const wrapper = mount(LabeledInput, {
      props: { ...props, showReexecutionIcon: true },
    });
    expect(wrapper.vm.showReexecutionIcon).toBe(true);
    const icon = wrapper.findComponent(ReexecutionIcon);
    expect(icon.exists()).toBe(true);
  });

  it("renders the description popover", async () => {
    const wrapper = mount(LabeledInput, { props });
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
    wrapper.setProps({ description: "foo" });
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
  });

  it("renders the flow variables button", () => {
    const wrapper = mount(LabeledInput, { props });
    expect(wrapper.findComponent(FlowVariableButton).exists()).toBe(true);
    expect(wrapper.findComponent(FlowVariableButton).props()).toStrictEqual({
      configKeys: props.configKeys,
      flowSettings: props.flowSettings,
      flowVariablesMap: props.flowVariablesMap,
      hover: false,
      path: props.path,
      subConfigKeys: props.subConfigKeys,
    });
  });

  // FIXME: UIEXT-253 - this needs to be added again once errors are properly passed and displayed
  /* it('renders error message on error', () => {
        const wrapper = mount(LabeledInput, { props: { errors: ['test error'] } });
        expect(wrapper.getComponent(ErrorMessage).props().errors).toStrictEqual(['test error']);
    }); */
});
