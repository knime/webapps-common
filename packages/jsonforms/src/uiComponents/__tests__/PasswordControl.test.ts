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

import { KdsPasswordInput } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils";
import PasswordControl from "../PasswordControl.vue";

describe("PasswordControl", () => {
  let props: VueControlTestProps<typeof PasswordControl>,
    wrapper: VueWrapper,
    handleChange: Mock;

  const MAGIC_PASSWORD = "*************";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("password"),
        data: "",
        schema: {
          properties: {
            password: {
              type: "string",
              title: "Password",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/password",
          options: {},
        },
      },
      disabled: false,
      isValid: true,
      labelForId: "password",
    };

    const component = await mountJsonFormsControlLabelContent(PasswordControl, {
      props,
    });
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(KdsPasswordInput).exists()).toBe(true);
    expect(wrapper.findComponent(KdsPasswordInput).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("calls handleChange when password input is changed", () => {
    const newPassword = "MySecurePassword123";
    wrapper
      .findComponent(KdsPasswordInput)
      .vm.$emit("update:modelValue", newPassword);
    expect(handleChange).toHaveBeenCalledWith("password", newPassword);
  });

  it("toggles visibility toggle based on password state", async () => {
    // Hidden when empty
    expect(
      wrapper.findComponent(KdsPasswordInput).props("showVisibilityToggle"),
    ).toBe(false);

    // Shown when not empty
    props = {
      ...props,
      control: {
        ...props.control,
        data: "password",
      },
    };
    const { wrapper: wrapper2 } = await mountJsonFormsControlLabelContent(
      PasswordControl,
      {
        props,
      },
    );
    expect(
      wrapper2.findComponent(KdsPasswordInput).props("showVisibilityToggle"),
    ).toBe(true);
  });

  describe("placeholder", () => {
    it("uses default placeholder text", () => {
      expect(wrapper.findComponent(KdsPasswordInput).props("placeholder")).toBe(
        "Password",
      );
    });

    it("uses custom placeholder from options", async () => {
      props = {
        ...props,
        control: {
          ...props.control,
          uischema: {
            ...props.control.uischema,
            options: {
              passwordPlaceholder: "Enter your password",
            },
          },
        },
      };
      const { wrapper } = await mountJsonFormsControlLabelContent(
        PasswordControl,
        {
          props,
        },
      );
      expect(wrapper.findComponent(KdsPasswordInput).props("placeholder")).toBe(
        "Enter your password",
      );
    });

    it("uses magic password placeholder when usePasswordPlaceholder is true", async () => {
      props = {
        ...props,
        control: {
          ...props.control,
          uischema: {
            ...props.control.uischema,
            options: {
              usePasswordPlaceholder: true,
            },
          },
        },
      };
      const { wrapper } = await mountJsonFormsControlLabelContent(
        PasswordControl,
        {
          props,
        },
      );
      expect(wrapper.findComponent(KdsPasswordInput).props("placeholder")).toBe(
        MAGIC_PASSWORD,
      );
    });
  });

  describe("variant", () => {
    it("uses default variant 'password'", () => {
      expect(wrapper.findComponent(KdsPasswordInput).props("variant")).toBe(
        "password",
      );
    });

    it("uses custom variant from options", async () => {
      props = {
        ...props,
        control: {
          ...props.control,
          uischema: {
            ...props.control.uischema,
            options: {
              variant: "key",
            },
          },
        },
      };
      const { wrapper } = await mountJsonFormsControlLabelContent(
        PasswordControl,
        {
          props,
        },
      );
      expect(wrapper.findComponent(KdsPasswordInput).props("variant")).toBe(
        "key",
      );
    });
  });

  describe("magic password handling", () => {
    it("does not handle magic password by default", async () => {
      props = {
        ...props,
        control: {
          ...props.control,
          data: MAGIC_PASSWORD,
        },
      };
      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        PasswordControl,
        {
          props,
        },
      );

      wrapper
        .findComponent(KdsPasswordInput)
        .vm.$emit("update:modelValue", "newPassword");
      expect(handleChange).toHaveBeenCalledWith("password", "newPassword");
    });

    it("handles magic password when option is enabled", async () => {
      props = {
        ...props,
        control: {
          ...props.control,
          data: MAGIC_PASSWORD,
          uischema: {
            ...props.control.uischema,
            options: {
              handleMagicPassword: true,
            },
          },
        },
      };
      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        PasswordControl,
        {
          props,
        },
      );

      wrapper
        .findComponent(KdsPasswordInput)
        .vm.$emit("update:modelValue", "newPassword");
      expect(handleChange).toHaveBeenCalledWith("password", "newPassword");
    });

    it("clears password when magic password is initial value and handleMagicPassword is true", async () => {
      props = {
        ...props,
        control: {
          ...props.control,
          data: MAGIC_PASSWORD,
          uischema: {
            ...props.control.uischema,
            options: {
              handleMagicPassword: true,
            },
          },
        },
      };
      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        PasswordControl,
        {
          props,
        },
      );

      wrapper
        .findComponent(KdsPasswordInput)
        .vm.$emit("update:modelValue", MAGIC_PASSWORD);
      expect(handleChange).toHaveBeenCalledWith("password", MAGIC_PASSWORD);
    });

    it("allows password change when initial value was not magic password", async () => {
      props = {
        ...props,
        control: {
          ...props.control,
          data: "regularPassword",
          uischema: {
            ...props.control.uischema,
            options: {
              handleMagicPassword: true,
            },
          },
        },
      };
      const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
        PasswordControl,
        {
          props,
        },
      );

      wrapper
        .findComponent(KdsPasswordInput)
        .vm.$emit("update:modelValue", "newPassword");
      expect(handleChange).toHaveBeenCalledWith("password", "newPassword");
    });
  });
});
