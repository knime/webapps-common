import { describe, expect, it } from "vitest";
import type { ControlElement } from "@jsonforms/core";

import { KdsLinkButton } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils";
import LinkControl from "../LinkControl.vue";

describe("LinkControl", () => {
  const path = "link";
  const createProps = (
    overrides?: Partial<VueControlTestProps<typeof LinkControl>>,
  ): VueControlTestProps<typeof LinkControl> => ({
    control: {
      ...getControlBase(path),
      data: undefined,
      schema: {},
      uischema: {
        type: "Control",
        scope: "#/properties/link",
        options: {
          to: "https://jsonforms.io",
        },
      },
    },
    disabled: false,
    labelForId: null,
    isValid: true,
    messages: { errors: [] },
    ...overrides,
  });
  const createUiSchemaWithOptions = ({
    to = "https://jsonforms.io",
    leadingIcon = undefined,
    trailingIcon = undefined,
    alignment = "left",
  }: {
    label?: string;
    to?: string;
    leadingIcon?: string;
    trailingIcon?: string;
    alignment?: string;
  } = {}): ControlElement => ({
    type: "Control",
    scope: "#/properties/link",
    options: {
      to,
      leadingIcon,
      trailingIcon,
      alignment,
    },
  });

  it("renders a link with the correct props", () => {
    const props = createProps();
    const { wrapper } = mountJsonFormsControl(LinkControl, { props });
    const linkButton = wrapper.findComponent(KdsLinkButton);
    expect(linkButton.exists()).toBe(true);
    expect(linkButton.props("to")).toBe("https://jsonforms.io");
  });

  it("sets alignment correctly - flex-start", () => {
    const flexEndProps = createProps({
      control: {
        ...getControlBase(path),
        data: undefined,
        schema: {},
        uischema: createUiSchemaWithOptions({ alignment: "left" }),
      },
    });
    const { wrapper } = mountJsonFormsControl(LinkControl, {
      props: flexEndProps,
    });
    const linkButton = wrapper.findComponent(KdsLinkButton);
    expect(linkButton.exists()).toBe(true);
    // @ts-expect-error test internal state
    expect(wrapper.vm.alignment).toBe("flex-start");
  });

  it("sets alignment correctly - flex-end", () => {
    const flexEndProps = createProps({
      control: {
        ...getControlBase(path),
        data: undefined,
        schema: {},
        uischema: createUiSchemaWithOptions({ alignment: "right" }),
      },
    });
    const { wrapper } = mountJsonFormsControl(LinkControl, {
      props: flexEndProps,
    });
    const linkButton = wrapper.findComponent(KdsLinkButton);
    expect(linkButton.exists()).toBe(true);
    // @ts-expect-error test internal state
    expect(wrapper.vm.alignment).toBe("flex-end");
  });
});
