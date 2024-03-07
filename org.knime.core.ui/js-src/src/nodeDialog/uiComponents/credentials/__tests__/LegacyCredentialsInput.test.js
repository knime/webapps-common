import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import LabeledInput from "../../label/LabeledInput.vue";
import DialogLabel from "../../label/DialogLabel.vue";
import { inputFormats } from "@/nodeDialog/constants";
import flushPromises from "flush-promises";
import LegacyCredentialsInput from "../LegacyCredentialsInput.vue";
import CredentialsInputBase from "../CredentialsInputBase.vue";

describe("LegacyCredentialsInput.vue", () => {
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
          properties: {
            legacyCredentials: {
              type: "object",
              credentials: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                  secondFactor: {
                    type: "string",
                  },
                },
                flowVarName: {
                  type: "string",
                },
              },
            },
          },
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
    component = mountJsonFormsComponent(LegacyCredentialsInput, { props });
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
    const { flowVariablesMap, updateData } = mountJsonFormsComponent(
      LegacyCredentialsInput,
      {
        props,
        provide: { flowVariablesApiMock, settingStateControllingGetMock },
      },
    );
    expect(flowVariablesMap[`${props.control.path}.credentials`]).toStrictEqual(
      {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: flowVarName,
      },
    );
    expect(setFlowVarState).toHaveBeenCalledWith(flowVarName);
    await flushPromises();
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      { credentials: flowVarValue, flowVarName: null },
    );
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
    const { flowVariablesMap, updateData } = mountJsonFormsComponent(
      LegacyCredentialsInput,
      {
        props,
        provide: { flowVariablesApiMock, settingStateControllingGetMock },
      },
    );
    expect(flowVariablesMap[`${props.control.path}.credentials`]).toStrictEqual(
      {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: flowVarName,
      },
    );
    expect(setFlowVarState).toHaveBeenNthCalledWith(1, flowVarName);
    await flushPromises();
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      { credentials: props.control.data.credentials, flowVarName: null },
    );
    expect(setFlowVarState).toHaveBeenNthCalledWith(2, flowVarName, {
      isFlawed: true,
    });
  });

  it("renders", () => {
    expect(wrapper.getComponent(LegacyCredentialsInput).exists()).toBeTruthy();
    expect(wrapper.findComponent(LabeledInput).exists()).toBeTruthy();
    expect(
      wrapper.findComponent(CredentialsInputBase).props().data,
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
    const { wrapper } = mountJsonFormsComponent(LegacyCredentialsInput, {
      props,
      withControllingFlowVariable: `${props.control.path}.credentials`,
    });
    await flushPromises();
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
