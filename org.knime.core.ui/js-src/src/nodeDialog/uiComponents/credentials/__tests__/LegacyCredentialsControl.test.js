import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import { inputFormats } from "../../../constants";
import DialogLabel from "../../label/DialogLabel.vue";
import LabeledControl from "../../label/LabeledControl.vue";
import CredentialsControlBase from "../CredentialsControlBase.vue";
import LegacyCredentialsControl from "../LegacyCredentialsControl.vue";

describe("LegacyCredentialsControl.vue", () => {
  let props, wrapper, component;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("legacyCredentials"),
        data: {
          credentials: {
            username: "username",
            password: "password",
            secondFactor: "secondFactor",
          },
        },
        schema: {
          type: "object",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/legacyCredentials",
          options: {
            format: inputFormats.legacyCredentials,
          },
        },
      },
    };
    component = mountJsonFormsComponent(LegacyCredentialsControl, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sets legacy flow variable on mounted", async () => {
    const flowVarName = "myFlowVar";
    const flowVarValue = {
      username: "flowVarUsername",
      password: "flowVarPassword",
    };
    const flowVariablesApiMock = {
      getFlowVariableOverrideValue: vi.fn().mockReturnValue(flowVarValue),
    };
    const setFlowVarState = vi.fn();
    const settingStateControllingGetMock = () => ({
      set: setFlowVarState,
    });
    props.control.data.flowVarName = flowVarName;
    const { flowVariablesMap, handleChange } = mountJsonFormsComponent(
      LegacyCredentialsControl,
      {
        props,
        provide: { flowVariablesApiMock, settingStateControllingGetMock },
      },
    );
    expect(flowVariablesMap[`${props.control.path}`]).toStrictEqual({
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: flowVarName,
    });
    expect(setFlowVarState).toHaveBeenCalledWith(flowVarName);
    await flushPromises();
    expect(handleChange).toHaveBeenCalledWith(props.control.path, {
      credentials: flowVarValue,
      flowVarName: null,
    });
  });

  it("sets legacy flow variable on mounted which is not available", async () => {
    const flowVarName = "myFlowVar";
    const flowVariablesApiMock = {
      getFlowVariableOverrideValue: vi.fn(),
    };
    const setFlowVarState = vi.fn();
    const settingStateControllingGetMock = () => ({
      set: setFlowVarState,
    });
    props.control.data.flowVarName = flowVarName;
    const { flowVariablesMap, handleChange } = mountJsonFormsComponent(
      LegacyCredentialsControl,
      {
        props,
        provide: { flowVariablesApiMock, settingStateControllingGetMock },
      },
    );
    expect(flowVariablesMap[`${props.control.path}`]).toStrictEqual({
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: flowVarName,
    });
    expect(setFlowVarState).toHaveBeenNthCalledWith(1, flowVarName);
    await flushPromises();
    expect(handleChange).toHaveBeenCalledWith(props.control.path, {
      credentials: props.control.data.credentials,
      flowVarName: null,
    });
    expect(setFlowVarState).toHaveBeenNthCalledWith(2, flowVarName, {
      isFlawed: true,
    });
  });

  it("renders", () => {
    expect(
      wrapper.getComponent(LegacyCredentialsControl).exists(),
    ).toBeTruthy();
    expect(wrapper.findComponent(LabeledControl).exists()).toBeTruthy();
    expect(
      wrapper.findComponent(CredentialsControlBase).props().data,
    ).toStrictEqual(props.control.data.credentials);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(dialogLabel.get(".credentials-input-wrapper").attributes().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("disables input when controlled by a flow variable", async () => {
    const { wrapper } = mountJsonFormsComponent(LegacyCredentialsControl, {
      props,
      withControllingFlowVariable: `${props.control.path}`,
    });
    await flushPromises();
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
