import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import CheckboxInput from "../CheckboxInput.vue";
import ErrorMessage from "../ErrorMessage.vue";
import DescriptionPopover from "../description/DescriptionPopover.vue";
import ReexecutionIcon from "@knime/styles/img/icons/reexecution.svg";
import { Checkbox } from "@knime/components";
import flushPromises from "flush-promises";

describe("CheckboxInput.vue", () => {
  let wrapper, defaultProps, component;

  beforeEach(async () => {
    defaultProps = {
      control: {
        ...getControlBase("test"),
        data: true,
        schema: {
          properties: {
            showTooltip: {
              type: "boolean",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/showTooltip",
          options: {
            format: "checkbox",
          },
        },
      },
    };
    component = await mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(CheckboxInput).exists()).toBe(true);
    expect(wrapper.getComponent(Checkbox).exists()).toBe(true);
    expect(wrapper.getComponent(ErrorMessage).exists()).toBe(true);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(false);
  });

  it("renders the description popover", async () => {
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
    wrapper.vm.control.description = "foo";
    await flushPromises(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when checkbox is changed", async () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, handleChange } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
      provide: { setDirtyModelSettingsMock },
    });
    await wrapper.findComponent(Checkbox).vm.$emit("update:modelValue", true);
    expect(handleChange).toHaveBeenCalledWith(defaultProps.control.path, true);
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("checks that re-execution icon is present if it is a model setting", async () => {
    const { wrapper } = await mountJsonFormsComponent(CheckboxInput, {
      props: {
        ...defaultProps,
        control: {
          ...defaultProps.control,
          uischema: {
            ...defaultProps.control.schema,
            scope: "#/properties/model/filterMissingValues",
          },
        },
      },
    });
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Checkbox).vm.modelValue).toBe(
      defaultProps.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.findComponent(Checkbox).props().disabled).toBeTruthy();
  });
});
