import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";

import { Label } from "@knime/components";
import ReexecutionIcon from "@knime/styles/img/icons/reexecution.svg";

import { injectionKey as injectionKeyShowAdvancedSettings } from "@/nodeDialog/composables/components/useAdvancedSettings";
import { injectionKey as providedByComponentKey } from "@/nodeDialog/composables/components/useFlowVariables";
import { injectionKey as injectionKeyHasNodeView } from "@/nodeDialog/composables/components/useHasNodeView";
import DialogComponentWrapper from "../../DialogComponentWrapper.vue";
import ErrorMessage from "../../ErrorMessage.vue";
import DescriptionPopover from "../../description/DescriptionPopover.vue";
import FlowVariableButton from "../../flowVariables/components/FlowVariableButton.vue";
import DialogLabel from "../DialogLabel.vue";
import LabeledControl from "../LabeledControl.vue";

describe("LabeledControl.vue", () => {
  let props, flowSettings;

  beforeEach(() => {
    flowSettings = ref(undefined);
    props = {
      control: {
        visible: true,
        path: "path.to.setting",
        schema: {},
        label: "title",
        uischema: {},
      },
    };
  });

  const mountLabeledControl = (
    { provideOverrides } = { provideOverrides: {} },
  ) =>
    mount(LabeledControl, {
      props,
      global: {
        provide: {
          [providedByComponentKey]: {
            flowSettings,
            configPaths: [],
          },
          [injectionKeyShowAdvancedSettings]: ref(false),
          [injectionKeyHasNodeView]: ref(false),
          getDialogPopoverTeleportDest: () => null,
          ...provideOverrides,
        },
      },
    });

  it("renders", () => {
    const wrapper = mountLabeledControl();
    expect(wrapper.getComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(false);
    expect(wrapper.findComponent(FlowVariableButton).exists()).toBe(true);
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
    expect(wrapper.findComponent(ErrorMessage).exists()).toBe(true);
  });

  it("visually displays model settings", () => {
    props.control.uischema.scope = "#/properties/model/...";
    const wrapper = mountLabeledControl({
      provideOverrides: {
        [injectionKeyHasNodeView]: ref(true),
      },
    });
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("fills the given space if desired", () => {
    props.fill = true;
    const wrapper = mountLabeledControl();
    expect(
      wrapper
        .findComponent(DialogComponentWrapper)
        .element.classList.contains("fill"),
    ).toBeTruthy();
    expect(
      wrapper.findComponent(DialogLabel).element.classList.contains("fill"),
    ).toBeTruthy();
  });

  it("sets custom margin bottom if desired", () => {
    expect(
      mountLabeledControl().findComponent(DialogComponentWrapper).element.style
        .marginBottom,
    ).toBe("0px");
    props.marginBottom = 30;
    expect(
      mountLabeledControl().findComponent(DialogComponentWrapper).element.style
        .marginBottom,
    ).toBe("30px");
  });

  describe("buttons", () => {
    it("renders the description popover", () => {
      const description = "foo";
      props.control.description = description;
      const wrapper = mountLabeledControl();
      expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
      expect(wrapper.findComponent(DescriptionPopover).props()).toStrictEqual({
        hover: false,
        html: description,
        ignoredClickOutsideTarget: null,
      });
    });

    it("renders the flow variables button", () => {
      const wrapper = mountLabeledControl();
      expect(wrapper.findComponent(FlowVariableButton).exists()).toBe(true);
      expect(wrapper.findComponent(FlowVariableButton).props()).toStrictEqual({
        hover: false,
      });
    });

    it("detects mouse hover", async () => {
      props.control.description = "description";
      const wrapper = mountLabeledControl();
      await wrapper.findComponent(DialogLabel).trigger("mouseover");
      expect(
        wrapper.findComponent(DescriptionPopover).props().hover,
      ).toBeTruthy();
      expect(
        wrapper.findComponent(FlowVariableButton).props().hover,
      ).toBeTruthy();
      await wrapper.findComponent(DialogLabel).trigger("mouseleave");
      expect(
        wrapper.findComponent(DescriptionPopover).props().hover,
      ).toBeFalsy();
      expect(
        wrapper.findComponent(FlowVariableButton).props().hover,
      ).toBeFalsy();
    });
  });

  it("renders error message on error", () => {
    const testError = "test error";
    props.control.errors = testError;
    const wrapper = mountLabeledControl();
    expect(wrapper.findComponent(ErrorMessage).props().errors).toStrictEqual([
      { message: testError },
    ]);
  });

  it("does not render the label line if the label is empty", () => {
    props.control.label = "";
    const wrapper = mountLabeledControl();
    expect(wrapper.findComponent(Label).exists()).toBeFalsy();
  });
});
