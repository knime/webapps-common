import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import CredentialsInput from "../CredentialsInput.vue";
import LabeledInput from "../LabeledInput.vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { inputFormats } from "@/nodeDialog/constants";

describe("CredentialsInput.vue", () => {
  let props, wrapper, component;

  beforeEach(() => {
    props = {
      control: {
        path: "credentials",
        enabled: true,
        visible: true,
        label: "label",
        data: {
          username: "username",
          password: "password",
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
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
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
    const labeledInput = wrapper.findComponent(LabeledInput);
    expect(labeledInput.get(".credentials-input-wrapper").attributes().id).toBe(
      labeledInput.vm.labelForId,
    );
    expect(labeledInput.vm.labeledElement).toBeDefined();
    expect(labeledInput.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("disables input when controlled by a flow variable", async () => {
    wrapper.vm.control.rootSchema.flowVariablesMap[props.control.path] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: "test",
      leaf: true,
    };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not render content of CredentialsInput when visible is false", async () => {
    wrapper.vm.control.visible = false;
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(LabeledInput).exists()).toBeFalsy();
  });

  it("checks that it is not rendered if it is an advanced setting", async () => {
    wrapper.vm.control.uischema.options.isAdvanced = true;
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(CredentialsInput).isVisible()).toBeFalsy();
  });

  it("checks that it is rendered if it is an advanced setting and advanced settings are shown", async () => {
    wrapper.vm.control.uischema.options.isAdvanced = true;
    wrapper.vm.control.rootSchema.showAdvancedSettings = true;
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.getComponent(CredentialsInput).isVisible()).toBeTruthy();
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
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(CredentialsInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    const username = "new user";
    wrapper
      .findAllComponents(InputField)[0]
      .vm.$emit("update:modelValue", username);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      { username, password: props.control.data.password },
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("updates data when password input is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(CredentialsInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
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
        isHiddenPassword: false,
      },
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    props.control.uischema.scope = "#/properties/model/properties/credentials";

    const dirtySettingsMock = vi.fn();
    const { wrapper } = mountJsonFormsComponent(CredentialsInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    const username = "new user";
    wrapper
      .findAllComponents(InputField)[0]
      .vm.$emit("update:modelValue", username);
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
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
});
