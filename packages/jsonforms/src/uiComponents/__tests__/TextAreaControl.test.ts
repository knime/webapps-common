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

import { TextArea } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import TextAreaControl from "../TextAreaControl.vue";

describe("TextAreaControl.vue", () => {
  let defaultProps: VueControlTestProps<typeof TextAreaControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "myLabelForId";

  beforeEach(async () => {
    defaultProps = {
      control: {
        ...getControlBase("test"),
        data: "test",
        schema: {
          properties: {
            xAxisLabel: {
              type: "string",
              title: "X Axis Label",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/test",
          options: {
            isAdvanced: false,
          },
        },
      },
      labelForId,
      disabled: false,
    };

    const component = await mountJsonFormsControlLabelContent(TextAreaControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  const changedTextInput = "Shaken not stirred";

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(TextArea).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(TextArea).props().id).toBe(labelForId);
  });

  it("calls changeValue when text area is changed", () => {
    wrapper
      .findComponent(TextArea)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(changeValue).toHaveBeenCalledWith(changedTextInput);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(TextArea).vm.modelValue).toBe(
      defaultProps.control.data,
    );
  });
});
