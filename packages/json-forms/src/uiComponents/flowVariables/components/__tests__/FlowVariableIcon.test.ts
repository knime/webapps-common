/* eslint-disable @typescript-eslint/no-unused-vars */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type Ref, ref } from "vue";
import { mount } from "@vue/test-utils";

import BothFlowVariables from "@knime/styles/img/icons/both-flow-variables.svg";
import ExposeFlowVariable from "@knime/styles/img/icons/expose-flow-variables.svg";
import OnlyFlowVariable from "@knime/styles/img/icons/only-flow-variables.svg";

import { type FlowSettings } from "../../../../api/types";
import { injectionKey as providedByComponentKey } from "../../../../composables/components/useFlowVariables";
import type { FlowVariableIconProps } from "../../types/FlowVariableIconProps";
import FlowVariableIcon from "../FlowVariableIcon.vue";

describe("FlowVariableIcon.vue", () => {
  let props: FlowVariableIconProps, flowSettings: Ref<FlowSettings | undefined>;

  beforeEach(() => {
    flowSettings = ref(undefined);
    props = {
      show: false,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mountFlowVariableIcon = ({
    props,
  }: {
    props: FlowVariableIconProps;
  }) => {
    return mount(FlowVariableIcon as any, {
      props,
      global: {
        provide: {
          [providedByComponentKey as symbol]: {
            flowSettings,
          },
        },
      },
    });
  };

  it("renders (nothing)", () => {
    const wrapper = mountFlowVariableIcon({ props });
    expect(wrapper.findComponent(BothFlowVariables).exists()).toBeFalsy();
    expect(wrapper.findComponent(ExposeFlowVariable).exists()).toBeFalsy();
    expect(wrapper.findComponent(OnlyFlowVariable).exists()).toBeFalsy();
    expect(wrapper.emitted("tooltip")?.[0]?.[0]).toBe("");
  });

  it("renders BothFlowVariables if both controlled and exposed", () => {
    flowSettings.value = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "foo",
      exposedFlowVariableName: "bar",
    };
    const wrapper = mountFlowVariableIcon({ props });
    expect(wrapper.findComponent(BothFlowVariables).exists()).toBeTruthy();
    expect(wrapper.emitted("tooltip")?.[0]?.[0]).toBe(
      "Config is overwritten by and output as a flow variable.",
    );
  });

  it("renders ExposeFlowVariable if not controlled but exposed", () => {
    flowSettings.value = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: null,
      exposedFlowVariableName: "bar",
    };
    const wrapper = mountFlowVariableIcon({ props });
    expect(wrapper.findComponent(ExposeFlowVariable).exists()).toBeTruthy();
    expect(wrapper.emitted("tooltip")?.[0]?.[0]).toBe(
      "Config is output as a flow variable.",
    );
  });

  it("renders OnlyFlowVariable if controlled but not exposed", () => {
    flowSettings.value = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "foo",
      exposedFlowVariableName: null,
    };
    const wrapper = mountFlowVariableIcon({ props });
    expect(wrapper.findComponent(OnlyFlowVariable).exists()).toBeTruthy();
    expect(wrapper.emitted("tooltip")?.[0]?.[0]).toBe(
      "Config is overwritten by a flow variable.",
    );
  });

  it("renders BothFlowVariables icon of forced to show", () => {
    props.show = true;
    const wrapper = mountFlowVariableIcon({ props });
    expect(wrapper.findComponent(BothFlowVariables).exists()).toBeTruthy();
    expect(wrapper.emitted("tooltip")?.[0]?.[0]).toBe("");
  });
});
