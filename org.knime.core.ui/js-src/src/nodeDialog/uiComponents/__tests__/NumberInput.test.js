import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import NumberInput from "../NumberInput.vue";
import NumberInputBase from "../NumberInputBase.vue";
import NumberInputComponent from "webapps-common/ui/components/forms/NumberInput.vue";
import ErrorMessage from "../ErrorMessage.vue";
import LabeledInput from "../label/LabeledInput.vue";
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

    component = mountJsonFormsComponent(NumberInput, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(NumberInput).exists()).toBe(true);
    expect(wrapper.getComponent(NumberInputBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(
      wrapper.getComponent(NumberInput).getComponent(ErrorMessage).exists(),
    ).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(NumberInputComponent).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("passes default props", () => {
    const numberInputProps = wrapper.getComponent(NumberInputBase).props();
    expect(numberInputProps.type).toBe("double");
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(NumberInputBase),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });

  it("calls onChange of NumberInputBase when number input is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(NumberInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    wrapper.findComponent(NumberInputBase).find("input").trigger("input");
    expect(updateData).toBeCalled();
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const dirtySettingsMock = vi.fn();
    props.control.uischema.scope = "#/properties/model/properties/yAxisColumn";
    const { wrapper } = mountJsonFormsComponent(NumberInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    wrapper.findComponent(NumberInputBase).find("input").trigger("input");
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("disables numberInputBase when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(NumberInput, {
      props,
      withControllingFlowVariable: true,
    });
    expect(wrapper.findComponent(NumberInputBase).vm.disabled).toBeTruthy();
  });

  it("rounds to minimum on focusout", () => {
    const minimum = 100;
    props.control.schema.minimum = minimum;
    props.control.data = minimum - 1;
    const component = mountJsonFormsComponent(NumberInput, { props });
    const wrapper = component.wrapper;
    wrapper.findComponent(NumberInputComponent).vm.$emit("focusout");
    expect(component.updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      minimum,
    );
  });

  it("rounds to maximum on focusout", () => {
    const maximum = 100;
    props.control.schema.maximum = maximum;
    props.control.data = maximum + 1;
    const component = mountJsonFormsComponent(NumberInput, { props });
    const wrapper = component.wrapper;
    wrapper.findComponent(NumberInputComponent).vm.$emit("focusout");
    expect(component.updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      maximum,
    );
  });
});
