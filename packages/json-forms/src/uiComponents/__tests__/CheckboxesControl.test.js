import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Checkboxes } from "@knime/components";
import ReexecutionIcon from "@knime/styles/img/icons/reexecution.svg";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import CheckboxesControl from "../CheckboxesControl.vue";
import ErrorMessage from "../ErrorMessage.vue";
import DescriptionPopover from "../description/DescriptionPopover.vue";

describe("CheckboxesControl.vue", () => {
  let wrapper, defaultProps, component, handleChange;

  beforeEach(async () => {
    defaultProps = {
      control: {
        ...getControlBase("test"),
        data: ["ADDED"],
        schema: {
          title: "Action",
          anyOf: [
            {
              const: "ADDED",
              title: "Added",
            },
            {
              const: "UPDATED",
              title: "Modified",
            },
            {
              const: "REMOVED",
              title: "Deleted",
            },
          ],
        },
        uischema: {
          type: "Control",
          scope: "#/properties/model/considerFile",
          options: {
            format: "checkboxes",
            checkboxLayout: "vertical",
          },
        },
      },
    };
    component = await mountJsonFormsComponent(CheckboxesControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(CheckboxesControl).exists()).toBe(true);
    expect(wrapper.getComponent(Checkboxes).exists()).toBe(true);
    expect(wrapper.getComponent(ErrorMessage).exists()).toBe(true);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("renders the description popover", async () => {
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
    wrapper.vm.control = { ...defaultProps.control, description: "foo" };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when checkbox is changed", async () => {
    await wrapper
      .findComponent(Checkboxes)
      .vm.$emit("update:modelValue", ["ADDED", "MODIFIED"]);
    expect(handleChange).toHaveBeenCalledWith(defaultProps.control.path, [
      "ADDED",
      "MODIFIED",
    ]);
  });

  it("checks that re-execution icon is present if it is a model setting", () => {
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Checkboxes).vm.modelValue).toStrictEqual(
      defaultProps.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(CheckboxesControl, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
