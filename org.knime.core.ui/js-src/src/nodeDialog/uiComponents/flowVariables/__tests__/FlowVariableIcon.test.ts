/* eslint-disable @typescript-eslint/no-unused-vars */
import OnlyFlowVariable from "webapps-common/ui/assets/img/icons/only-flow-variables.svg";
import ExposeFlowVariable from "webapps-common/ui/assets/img/icons/expose-flow-variables.svg";
import BothFlowVariables from "webapps-common/ui/assets/img/icons/both-flow-variables.svg";

import { mount } from "@vue/test-utils";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import FlowVariableIcon from "../FlowVariableIcon.vue";

import type FlowVariableIconProps from "../types/FlowVariableIconProps";

describe("FlowVariableIcon.vue", () => {
  let props: FlowVariableIconProps;

  beforeEach(() => {
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
    props.flowSettings = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "foo",
      exposedFlowVariableName: "bar",
    };
    const wrapper = mountFlowVariableIcon({ props });
    expect(wrapper.findComponent(BothFlowVariables).exists()).toBeTruthy();
    expect(wrapper.emitted("tooltip")?.[0]?.[0]).toBe(
      "Config is overwritten by flow variable and exposes a flow variable.",
    );
  });

  it("renders ExposeFlowVariable if not controlled but exposed", () => {
    props.flowSettings = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: null,
      exposedFlowVariableName: "bar",
    };
    const wrapper = mountFlowVariableIcon({ props });
    expect(wrapper.findComponent(ExposeFlowVariable).exists()).toBeTruthy();
    expect(wrapper.emitted("tooltip")?.[0]?.[0]).toBe(
      "Config exposes a flow variable.",
    );
  });

  it("renders OnlyFlowVariable if controlled but not exposed", () => {
    props.flowSettings = {
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
