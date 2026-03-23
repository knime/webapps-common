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

import { KdsUsernameInput } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils";
import UsernameControl from "../UsernameControl.vue";

describe("UsernameControl", () => {
  let props: VueControlTestProps<typeof UsernameControl>,
    wrapper: VueWrapper,
    handleChange: Mock;

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("username"),
        data: "",
        schema: {
          properties: {
            username: {
              type: "string",
              title: "Username",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/username",
          options: {},
        },
      },
      disabled: false,
      isValid: true,
      messages: { errors: [] },
    };

    const component = await mountJsonFormsControl(UsernameControl, {
      props,
    });
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders and sets initial username from control data", async () => {
    expect(wrapper.findComponent(KdsUsernameInput).exists()).toBe(true);
    expect(wrapper.findComponent(KdsUsernameInput).vm.modelValue).toBe(
      props.control.data,
    );

    props = {
      ...props,
      control: {
        ...props.control,
        data: "existingUser",
      },
    };
    const { wrapper: wrapper2 } = await mountJsonFormsControl(UsernameControl, {
      props,
    });
    expect(wrapper2.findComponent(KdsUsernameInput).vm.modelValue).toBe(
      "existingUser",
    );
  });

  it("calls handleChange when username input is changed", () => {
    const testCases = [
      { value: "john.doe", description: "regular username" },
      { value: "", description: "empty username" },
      { value: "user.name+test@domain", description: "special characters" },
    ];

    testCases.forEach(({ value }) => {
      wrapper
        .findComponent(KdsUsernameInput)
        .vm.$emit("update:modelValue", value);
      expect(handleChange).toHaveBeenCalledWith("username", value);
    });
  });

  it("passes label and description to KdsUsernameInput", async () => {
    expect(wrapper.findComponent(KdsUsernameInput).props("label")).toBe(
      props.control.label,
    );

    props = {
      ...props,
      control: {
        ...props.control,
        description: "Enter your username",
      },
    };
    const { wrapper: wrapper2 } = await mountJsonFormsControl(UsernameControl, {
      props,
    });
    expect(wrapper2.findComponent(KdsUsernameInput).props("description")).toBe(
      "Enter your username",
    );
  });

  it("handles disabled prop correctly", async () => {
    expect(wrapper.findComponent(KdsUsernameInput).props("disabled")).toBe(
      false,
    );

    const disabledProps = {
      ...props,
      disabled: true,
    };
    const { wrapper: wrapper2 } = await mountJsonFormsControl(UsernameControl, {
      props: disabledProps,
    });
    expect(wrapper2.findComponent(KdsUsernameInput).props("disabled")).toBe(
      true,
    );
  });
});
