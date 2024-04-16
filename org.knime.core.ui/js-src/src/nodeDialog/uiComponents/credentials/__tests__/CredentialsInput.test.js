import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import CredentialsInput from "../CredentialsInput.vue";
import LabeledInput from "../../label/LabeledInput.vue";
import DialogLabel from "../../label/DialogLabel.vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { inputFormats } from "@/nodeDialog/constants";
import flushPromises from "flush-promises";

describe("CredentialsInput.vue", () => {
  let props, wrapper, component;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("credentials"),
        data: {
          username: "username",
          password: "password",
          secondFactor: "secondFactor",
        },
        schema: {
          properties: {
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
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/credentials",
          options: {
            format: inputFormats.credentials,
          },
        },
      },
    };

    component = mountJsonFormsComponent(CredentialsInput, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(CredentialsInput).exists()).toBeTruthy();
    expect(wrapper.findComponent(LabeledInput).exists()).toBeTruthy();
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers).toHaveLength(2);
    expect(inputFieldWrappers[0].exists()).toBeTruthy();
    expect(inputFieldWrappers[1].exists()).toBeTruthy();
  });

  it("renders with empty data", () => {
    props.control.data = {};
    component = mountJsonFormsComponent(CredentialsInput, { props });
    const wrapper = component.wrapper;
    expect(wrapper.getComponent(CredentialsInput).exists()).toBeTruthy();
    expect(wrapper.findComponent(LabeledInput).exists()).toBeTruthy();
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers[0].exists()).toBeTruthy();
    expect(inputFieldWrappers[0].props().modelValue).toBe("");
    expect(inputFieldWrappers[1].exists()).toBeTruthy();
    expect(inputFieldWrappers[1].props().modelValue).toBe("");
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
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, {
      props,
      withControllingFlowVariable: true,
    });
    await flushPromises();
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("sets correct initial value", () => {
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers[0].vm.modelValue).toBe(
      props.control.data.username,
    );
    expect(inputFieldWrappers[1].vm.modelValue).toBe(
      props.control.data.password,
    );
  });

  it("sets magic password", async () => {
    wrapper.vm.control.data.isHiddenPassword = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents(InputField)[1].vm.modelValue).toBe(
      "*****************",
    );
  });

  it("sets correct labels", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers[0].get("input").attributes().placeholder).toBe(
      "Username",
    );
    expect(inputFieldWrappers[1].get("input").attributes().placeholder).toBe(
      "Password",
    );
  });

  it("updates data when username input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(CredentialsInput, {
      props,
      provide: { setDirtyModelSettingsMock },
    });
    const username = "new user";
    wrapper
      .findAllComponents(InputField)[0]
      .vm.$emit("update:modelValue", username);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      {
        username,
        password: props.control.data.password,
        secondFactor: props.control.data.secondFactor,
      },
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("updates data when password input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(CredentialsInput, {
      props,
      provide: { setDirtyModelSettingsMock },
    });
    const password = "new password";
    wrapper
      .findAllComponents(InputField)[1]
      .vm.$emit("update:modelValue", password);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      {
        username: props.control.data.username,
        password,
        secondFactor: props.control.data.secondFactor,
        isHiddenPassword: false,
      },
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets flow variable value in data if controlling flow variable is set", async () => {
    await wrapper
      .findComponent(LabeledInput)
      .vm.$emit("controllingFlowVariableSet", {
        username: "flowVarUsername",
        isHiddenPassword: true,
      });
    expect(component.updateData).toHaveBeenCalledWith(
      expect.anything(),
      "credentials",
      {
        isHiddenPassword: true,
        password: props.control.data.password,
        secondFactor: props.control.data.secondFactor,
        username: "flowVarUsername",
      },
    );
  });

  it("sets flow variable name in data if controlling flow variable is set", async () => {
    const { wrapper, updateData, flowVariablesMap } = mountJsonFormsComponent(
      CredentialsInput,
      {
        props,
      },
    );
    const flowVarName = "flowVar1";
    flowVariablesMap.credentials = {
      controllingFlowVariableName: flowVarName,
    };
    wrapper.vm.control = { ...wrapper.vm.control };
    await flushPromises();
    expect(updateData).toHaveBeenCalledWith(expect.anything(), "credentials", {
      flowVariableName: flowVarName,
      password: "password",
      username: "username",
      secondFactor: "secondFactor",
    });
  });

  it("clears data if controlling flow variable is unset", async () => {
    const { wrapper, updateData, flowVariablesMap } = mountJsonFormsComponent(
      CredentialsInput,
      {
        props,
        withControllingFlowVariable: true,
      },
    );
    flowVariablesMap.credentials.controllingFlowVariableName = null;
    wrapper.vm.control = { ...wrapper.vm.control };
    await flushPromises();
    expect(updateData).toHaveBeenCalledWith(expect.anything(), "credentials", {
      password: "",
      username: "",
      secondFactor: "",
    });
  });

  it("hides username input field when configured to do so", () => {
    props.control.uischema.options.hideUsername = true;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers).toHaveLength(1);
    expect(inputFieldWrappers[0].get("input").attributes().type).toBe(
      "password",
    );
  });

  it("hides username by state provider", async () => {
    const addStateProviderListenerMock = vi.fn();
    const hasUsernameProvider = "myHasUsernameProvider";
    props.control.uischema.options.hasUsernameProvider = hasUsernameProvider;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, {
      props,
      provide: { addStateProviderListenerMock },
    });
    const [{ id }, callback] = addStateProviderListenerMock.mock.calls[0];
    expect(id).toBe(hasUsernameProvider);
    expect(wrapper.findAllComponents(InputField)).toHaveLength(2);
    callback(false);
    await flushPromises();
    expect(wrapper.findAllComponents(InputField)).toHaveLength(1);
  });

  it("hides password by state provider", async () => {
    const addStateProviderListenerMock = vi.fn();
    const hasPasswordProvider = "myUsernameProvider";
    props.control.uischema.options.hasPasswordProvider = hasPasswordProvider;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, {
      props,
      provide: { addStateProviderListenerMock },
    });
    const [{ id }, callback] = addStateProviderListenerMock.mock.calls[0];
    expect(id).toBe(hasPasswordProvider);
    expect(wrapper.findAllComponents(InputField)).toHaveLength(2);
    callback(false);
    await flushPromises();
    expect(wrapper.findAllComponents(InputField)).toHaveLength(1);
  });

  it("hides password input field when configured to do so", () => {
    props.control.uischema.options.hidePassword = true;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers).toHaveLength(1);
    expect(inputFieldWrappers[0].get("input").attributes().type).toBe("text");
  });

  it("uses a custom username label if provided with one", () => {
    props.control.uischema.options.usernameLabel = "Custom Username";
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    expect(
      wrapper.findAllComponents(InputField)[0].get("input").attributes()
        .placeholder,
    ).toBe(props.control.uischema.options.usernameLabel);
  });

  it("uses a custom password label if provided with one", () => {
    props.control.uischema.options.passwordLabel = "Custom Password";
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    expect(
      wrapper.findAllComponents(InputField)[1].get("input").attributes()
        .placeholder,
    ).toBe(props.control.uischema.options.passwordLabel);
  });

  it("shows second factor input field when configured to do so", () => {
    props.control.uischema.options.showSecondFactor = true;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers).toHaveLength(3);
    expect(inputFieldWrappers[0].get("input").attributes().type).toBe("text");
    expect(inputFieldWrappers[1].get("input").attributes().type).toBe(
      "password",
    );
    expect(inputFieldWrappers[2].get("input").attributes().type).toBe(
      "password",
    );
  });

  it("does not show second factor input field when password is hidden", () => {
    props.control.uischema.options.hidePassword = true;
    props.control.uischema.options.showSecondFactor = true;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers).toHaveLength(1);
    expect(inputFieldWrappers[0].get("input").attributes().type).toBe("text");
  });

  it("updates data when second factor input is changed", () => {
    props.control.uischema.options.showSecondFactor = true;
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(CredentialsInput, {
      props,
      provide: { setDirtyModelSettingsMock },
    });
    const secondFactor = "new second factor";
    wrapper
      .findAllComponents(InputField)[2]
      .vm.$emit("update:modelValue", secondFactor);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      {
        username: props.control.data.username,
        password: props.control.data.password,
        secondFactor,
        isHiddenSecondFactor: false,
      },
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("uses a custom second factor label if provided with one", () => {
    props.control.uischema.options.showSecondFactor = true;
    props.control.uischema.options.secondFactorLabel = "Custom Second Factor";
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    expect(
      wrapper.findAllComponents(InputField)[2].get("input").attributes()
        .placeholder,
    ).toBe(props.control.uischema.options.secondFactorLabel);
  });

  it("sets magic second factor", async () => {
    props.control.uischema.options.showSecondFactor = true;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    wrapper.vm.control.data.isHiddenSecondFactor = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents(InputField)[2].vm.modelValue).toBe(
      "*****************",
    );
  });

  it("sets correct second factor label", () => {
    props.control.uischema.options.showSecondFactor = true;
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, { props });
    expect(wrapper.find("label").text()).toBe(props.control.label);
    const inputFieldWrappers = wrapper.findAllComponents(InputField);
    expect(inputFieldWrappers[2].get("input").attributes().placeholder).toBe(
      "Second authentication factor",
    );
  });
});
