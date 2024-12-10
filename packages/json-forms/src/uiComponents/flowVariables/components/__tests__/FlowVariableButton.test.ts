/* eslint-disable @typescript-eslint/no-unused-vars */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import { FunctionButton } from "@knime/components";

import {
  type ConfigPath,
  injectionKey as flowVariablesInjectionKey,
} from "../../../../composables/components/useFlowVariables";
import DialogPopover from "../../../../popover/DialogPopover.vue";
import type { FlowVariableButtonProps } from "../../types/FlowVariableButtonProps";
import FlowVariableButton from "../FlowVariableButton.vue";
import FlowVariableIcon from "../FlowVariableIcon.vue";
import FlowVariablePopover from "../FlowVariablePopover.vue";

describe("FlowVariableButton.vue", () => {
  let props: FlowVariableButtonProps;

  beforeEach(() => {
    props = {
      hover: false,
    };
  });

  window.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mountFlowVariableButton = ({
    props,
    configPaths,
  }: {
    props: FlowVariableButtonProps;
    configPaths?: ConfigPath[];
  }) => {
    return mount(FlowVariableButton as any, {
      props,
      global: {
        stubs: {
          FlowVariablePopover: true,
          FlowVariableIcon: true,
        },
        provide: {
          getDialogPopoverTeleportDest: () => null,
          [flowVariablesInjectionKey as symbol]: {
            configPaths: ref(
              configPaths ?? [
                {
                  configPath: "configPath",
                  dataPath: "dataPath",
                  deprecatedConfigPaths: [],
                },
              ],
            ),
          },
        },
      },
    });
  };

  it("renders", () => {
    const wrapper = mountFlowVariableButton({ props });

    // Components
    expect(wrapper.findComponent(DialogPopover).exists()).toBeTruthy();
    expect(wrapper.findComponent(FlowVariableIcon).exists()).toBeTruthy();
    expect(wrapper.findComponent(FlowVariablePopover).exists()).toBeFalsy();

    // Props
    expect(wrapper.findComponent(DialogPopover).props()).toStrictEqual({
      ignoredClickOutsideTarget: null,
      tooltip: "Click to overwrite with or output as flow variable.",
      popoverWidth: "380px",
    });
    expect(wrapper.findComponent(FlowVariableIcon).props()).toStrictEqual({
      show: false,
    });
  });

  it("does not render when no dataPaths are provided", () => {
    const wrapper = mountFlowVariableButton({ props, configPaths: [] });
    expect(wrapper.isVisible()).toBeFalsy();
  });

  describe("show flow variable icon", () => {
    it("shows icon on hover", () => {
      props.hover = true;
      const wrapper = mountFlowVariableButton({ props });
      expect(wrapper.findComponent(FlowVariableIcon).props().show).toBeTruthy();
    });

    it("shows icon on focusin and hides on focusout", async () => {
      const wrapper = mountFlowVariableButton({ props });
      wrapper.findComponent(FunctionButton).vm.$emit("focus");
      await flushPromises();
      expect(wrapper.findComponent(FlowVariableIcon).props().show).toBeTruthy();
      wrapper.findComponent(FunctionButton).vm.$emit("blur");
      await flushPromises();
      expect(wrapper.findComponent(FlowVariableIcon).props().show).toBeFalsy();
    });

    it("shows icon when expanded", async () => {
      const wrapper = mountFlowVariableButton({ props });
      await wrapper.find(".function-button").trigger("mouseup");
      expect(wrapper.findComponent(FlowVariableIcon).props().show).toBeTruthy();
    });
  });

  it("sets tooltip prefix", async () => {
    const wrapper = mountFlowVariableButton({ props });
    const tooltipPrefix = "myTooltipPrefix";
    await wrapper
      .findComponent(FlowVariableIcon)
      .vm.$emit("tooltip", tooltipPrefix);
    expect(wrapper.findComponent(DialogPopover).props().tooltip).toBe(
      "myTooltipPrefix Click to overwrite with or output as flow variable.",
    );
  });

  it("opens FlowVariablePopover on button click", async () => {
    const wrapper = mountFlowVariableButton({ props });
    await wrapper.find(".function-button").trigger("mouseup");
    const box = wrapper.find(".box");
    const popover = box.findComponent(FlowVariablePopover);
    expect(popover.exists()).toBeTruthy();
  });
});
