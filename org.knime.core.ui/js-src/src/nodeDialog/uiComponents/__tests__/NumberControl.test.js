import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import NumberControl from "../NumberControl.vue";
import NumberControlBase from "../NumberControlBase.vue";
import { NumberInput } from "@knime/components";
import ErrorMessage from "../ErrorMessage.vue";
import LabeledControl from "../label/LabeledControl.vue";
import DialogLabel from "../label/DialogLabel.vue";

describe("NumberInput.vue", () => {
  let props, wrapper, component;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        schema: {
          properties: {
            maxRows: {
              type: "double",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: "double",
          },
        },
      },
    };

    component = mountJsonFormsComponent(NumberControl, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(NumberControl).exists()).toBe(true);
    expect(wrapper.getComponent(NumberControlBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(
      wrapper.getComponent(NumberControl).getComponent(ErrorMessage).exists(),
    ).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(NumberInput).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("passes default props", () => {
    const numberInputProps = wrapper.getComponent(NumberControlBase).props();
    expect(numberInputProps.type).toBe("double");
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(NumberControlBase),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });

  it("calls onChange of NumberControlBase when number input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, handleChange } = mountJsonFormsComponent(NumberControl, {
      props,
      provide: { setDirtyModelSettingsMock },
    });
    wrapper.findComponent(NumberControlBase).find("input").trigger("input");
    expect(handleChange).toBeCalled();
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("disables numberInputBase when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(NumberControl, {
      props,
      withControllingFlowVariable: true,
    });
    expect(wrapper.findComponent(NumberControlBase).vm.disabled).toBeTruthy();
  });

  it("rounds to minimum on focusout", () => {
    const minimum = 100;
    props.control.schema.minimum = minimum;
    props.control.data = minimum - 1;
    const component = mountJsonFormsComponent(NumberControl, { props });
    const wrapper = component.wrapper;
    wrapper.findComponent(NumberInput).vm.$emit("focusout");
    expect(component.handleChange).toHaveBeenCalledWith(
      props.control.path,
      minimum,
    );
  });

  it("rounds to maximum on focusout", () => {
    const maximum = 100;
    props.control.schema.maximum = maximum;
    props.control.data = maximum + 1;
    const component = mountJsonFormsComponent(NumberControl, { props });
    const wrapper = component.wrapper;
    wrapper.findComponent(NumberInput).vm.$emit("focusout");
    expect(component.handleChange).toHaveBeenCalledWith(
      props.control.path,
      maximum,
    );
  });
});
