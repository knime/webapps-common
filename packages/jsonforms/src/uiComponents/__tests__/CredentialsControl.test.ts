import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { FunctionButton, InputField } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import CredentialsControl from "../CredentialsControl.vue";

describe("CredentialsControl", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof CredentialsControl>,
    handleChange: Mock;

  const labelForId = "labelForId";
  const path = "credentials";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("credentials"),
        data: { username: "testUser", password: "testPassword" },
        schema: {
          username: { default: "" },
          password: { default: "" },
        } as unknown as typeof props.control.schema,
        uischema: {
          type: "Control",
          scope: "#/properties/credentials",
          options: {},
        },
      },
      disabled: false,
      isValid: false,
      labelForId,
    };

    const component = await mountJsonFormsControlLabelContent(
      CredentialsControl,
      { props },
    );
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders username and password fields", () => {
      const inputFields = wrapper.findAllComponents(InputField);
      expect(inputFields).toHaveLength(2);
    });

    it("renders only password field when usePasswordOnly is true", async () => {
      props.control.uischema.options!.usePasswordOnly = true;
      props.control.data = "secretPassword";

      const { wrapper } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const inputFields = wrapper.findAllComponents(InputField);
      expect(inputFields).toHaveLength(1);
      expect(wrapper.find(".username").exists()).toBe(false);
    });
  });

  describe("initial values", () => {
    it("sets correct initial username and password", () => {
      const inputFields = wrapper.findAllComponents(InputField);
      expect(inputFields[0].props("modelValue")).toBe("testUser");
      expect(inputFields[1].props("modelValue")).toBe("testPassword");
    });

    it("uses default values when no data provided", async () => {
      props.control.data = undefined as unknown as {
        username: string;
        password: string;
      };
      props.control.schema = {
        username: { default: "defaultUser" },
        password: { default: "defaultPass" },
      } as unknown as typeof props.control.schema;

      const { wrapper } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const inputFields = wrapper.findAllComponents(InputField);
      expect(inputFields[0].props("modelValue")).toBe("defaultUser");
      expect(inputFields[1].props("modelValue")).toBe("defaultPass");
    });

    it("uses default password when usePasswordOnly and no data provided", async () => {
      props.control.uischema.options!.usePasswordOnly = true;
      props.control.data = undefined as unknown as string;
      props.control.schema = {
        password: { default: "defaultSecretPass" },
      } as unknown as typeof props.control.schema;

      const { wrapper } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const inputFields = wrapper.findAllComponents(InputField);
      expect(inputFields[0].props("modelValue")).toBe("defaultSecretPass");
    });
  });

  describe("change handling", () => {
    it("calls handleChange when username is changed", async () => {
      const usernameInput = wrapper.findAllComponents(InputField)[0];
      await usernameInput.vm.$emit("update:modelValue", "newUsername");

      expect(handleChange).toHaveBeenCalledWith(path, {
        username: "newUsername",
        password: "testPassword",
      });
    });

    it("calls handleChange when password is changed", async () => {
      const passwordInput = wrapper.findAllComponents(InputField)[1];
      await passwordInput.vm.$emit("update:modelValue", "newPassword");

      expect(handleChange).toHaveBeenCalledWith(path, {
        username: "testUser",
        password: "newPassword",
      });
    });

    it("calls handleChange with only password when usePasswordOnly is true", async () => {
      props.control.uischema.options!.usePasswordOnly = true;
      props.control.data = "initialPassword";

      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const passwordInput = wrapper.findAllComponents(InputField)[0];
      await passwordInput.vm.$emit("update:modelValue", "newSecretPassword");

      expect(handleChange).toHaveBeenCalledWith(path, "newSecretPassword");
    });
  });

  describe("magic password handling", () => {
    const MAGIC_PASSWORD = "*************";

    it("clears password when username changes and magic password is present", async () => {
      props.control.uischema.options!.handleMagicPassword = true;
      props.control.data = { username: "user", password: MAGIC_PASSWORD };

      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const usernameInput = wrapper.findAllComponents(InputField)[0];
      await usernameInput.vm.$emit("update:modelValue", "newUser");

      expect(handleChange).toHaveBeenCalledWith(path, {
        username: "newUser",
        password: "",
      });
    });

    it("does not clear password when magic password handling is disabled", async () => {
      props.control.uischema.options!.handleMagicPassword = false;
      props.control.data = { username: "user", password: MAGIC_PASSWORD };

      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const usernameInput = wrapper.findAllComponents(InputField)[0];
      await usernameInput.vm.$emit("update:modelValue", "newUser");

      expect(handleChange).toHaveBeenCalledWith(path, {
        username: "newUser",
        password: MAGIC_PASSWORD,
      });
    });

    it("does not clear password when password was manually changed", async () => {
      props.control.uischema.options!.handleMagicPassword = true;
      props.control.data = { username: "user", password: MAGIC_PASSWORD };

      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      // First change the password
      const passwordInput = wrapper.findAllComponents(InputField)[1];
      await passwordInput.vm.$emit("update:modelValue", "newPassword");

      // Then change the username
      const usernameInput = wrapper.findAllComponents(InputField)[0];
      await usernameInput.vm.$emit("update:modelValue", "newUser");

      // Password should not be cleared because it was changed
      expect(handleChange).toHaveBeenLastCalledWith(path, {
        username: "newUser",
        password: "newPassword",
      });
    });
  });

  describe("password visibility toggle", () => {
    it("initially hides password", () => {
      const passwordInput = wrapper.findAllComponents(InputField)[1];
      expect(passwordInput.props("type")).toBe("Password");
    });

    it("shows password toggle button when password is not empty", () => {
      const toggleButton = wrapper.findComponent(FunctionButton);
      expect(toggleButton.isVisible()).toBe(true);
    });

    it("hides password toggle button when password is empty", async () => {
      props.control.data = { username: "testUser", password: "" };

      const { wrapper } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const toggleButton = wrapper.findComponent(FunctionButton);
      expect(toggleButton.isVisible()).toBe(false);
    });

    it("toggles password visibility when button is clicked", async () => {
      const toggleButton = wrapper.findComponent(FunctionButton);
      const passwordInput = wrapper.findAllComponents(InputField)[1];

      expect(passwordInput.props("type")).toBe("Password");

      await toggleButton.trigger("click");
      expect(passwordInput.props("type")).toBe("text");

      await toggleButton.trigger("click");
      expect(passwordInput.props("type")).toBe("Password");
    });
  });

  describe("placeholder handling", () => {
    it("uses default password placeholder", () => {
      const passwordInput = wrapper.findAllComponents(InputField)[1];
      expect(passwordInput.props("placeholder")).toBe("Password");
    });

    it("uses custom password placeholder from options", async () => {
      props.control.uischema.options!.passwordPlaceholder = "Enter secret";

      const { wrapper } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const passwordInput = wrapper.findAllComponents(InputField)[1];
      expect(passwordInput.props("placeholder")).toBe("Enter secret");
    });

    it("uses magic password as placeholder when usePasswordPlaceholder is true", async () => {
      props.control.uischema.options!.usePasswordPlaceholder = true;

      const { wrapper } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props },
      );

      const passwordInput = wrapper.findAllComponents(InputField)[1];
      expect(passwordInput.props("placeholder")).toBe("*************");
    });

    it("has Username placeholder for username field", () => {
      const usernameInput = wrapper.findAllComponents(InputField)[0];
      expect(usernameInput.props("placeholder")).toBe("Username");
    });
  });

  describe("disabled state", () => {
    it("disables both input fields when disabled prop is true", async () => {
      const disabledProps = { ...props, disabled: true };

      const { wrapper } = await mountJsonFormsControlLabelContent(
        CredentialsControl,
        { props: disabledProps },
      );

      const inputFields = wrapper.findAllComponents(InputField);
      expect(inputFields[0].props("disabled")).toBe(true);
      expect(inputFields[1].props("disabled")).toBe(true);
    });

    it("enables both input fields when disabled prop is false", () => {
      const inputFields = wrapper.findAllComponents(InputField);
      expect(inputFields[0].props("disabled")).toBe(false);
      expect(inputFields[1].props("disabled")).toBe(false);
    });
  });
});
