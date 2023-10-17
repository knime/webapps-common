import {
  afterEach,
  beforeEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import CredentialsInput from "../CredentialsInput.vue";
import LabeledInput from "../LabeledInput.vue";
import { inputFormats } from "@/nodeDialog/constants";

describe("CredentialsInput.vue", () => {
  let props, wrapper, onChangeUsernameSpy, onChangePasswordSpy, component;

  beforeAll(() => {
    onChangeUsernameSpy = vi.spyOn(
      CredentialsInput.methods,
      "onChangeUsername",
    );
    onChangePasswordSpy = vi.spyOn(
      CredentialsInput.methods,
      "onChangePassword",
    );
  });

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
    expect(wrapper.getComponent(".input-field-username").exists()).toBeTruthy();
    expect(wrapper.getComponent(".input-field-password").exists()).toBeTruthy();
  });

  it("sets labelForId", () => {
    const labeledInput = wrapper.findComponent(LabeledInput);
    expect(labeledInput.get(".input-fields-wrapper").attributes().id).toBe(
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
    expect(wrapper.getComponent(".input-field-username").vm.modelValue).toBe(
      props.control.data.username,
    );
    expect(wrapper.getComponent(".input-field-password").vm.modelValue).toBe(
      props.control.data.password,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("calls onChangeUsername when username input is changed", () => {
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
      .getComponent(".input-field-username")
      .vm.$emit("update:modelValue", username);
    expect(onChangeUsernameSpy).toHaveBeenCalledWith(username);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      { username, password: props.control.data.password },
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("calls onChangePassword when password input is changed", () => {
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
      .getComponent(".input-field-password")
      .vm.$emit("update:modelValue", password);
    expect(onChangePasswordSpy).toHaveBeenCalledWith(password);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      { username: props.control.data.username, password },
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    props.control.uischema.scope = "#/properties/model/properties/credentials";

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
      .getComponent(".input-field-username")
      .vm.$emit("update:modelValue", username);
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      { username, password: props.control.data.password },
    );
  });
});
