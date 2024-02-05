import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import DateTimeInput from "../DateTimeInput.vue";
import LabeledInput from "../label/LabeledInput.vue";
import DialogLabel from "../label/DialogLabel.vue";
import DateTimeInputBase from "webapps-common/ui/components/forms/DateTimeInput.vue";

describe("DateTimeInput.vue", () => {
  let defaultProps, wrapper, component;

  beforeEach(() => {
    defaultProps = {
      control: {
        ...getControlBase("test"),
        data: "2022-12-12T20:22:22.000Z",
        schema: {
          properties: {
            dateTime: {
              type: "string",
              format: "date-time",
              title: "date&time",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/dateTime",
          options: {
            isAdvanced: false,
          },
        },
      },
    };

    component = mountJsonFormsComponent(DateTimeInput, { props: defaultProps });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(DateTimeInput).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(DateTimeInputBase).exists()).toBe(true);
  });

  it("sets labelForId", async () => {
    await wrapper.vm.$nextTick();
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(DateTimeInputBase).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls updateData when text input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(DateTimeInput, {
      props: defaultProps,
      provide: { setDirtyModelSettingsMock },
    });
    const changedDateTimeInput = new Date("2022-12-12T20:22:22.000Z");
    wrapper
      .findComponent(DateTimeInputBase)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedDateTimeInput,
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(DateTimeInput, {
      props: {
        ...defaultProps,
        control: {
          ...defaultProps.control,
          uischema: {
            ...defaultProps.control.schema,
            scope: "#/properties/model/properties/dateTime",
          },
        },
      },
      provide: { setDirtyModelSettingsMock },
    });
    const changedDateTimeInput = "Shaken not stirred";
    wrapper
      .findComponent(DateTimeInputBase)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(setDirtyModelSettingsMock).toHaveBeenCalled();
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedDateTimeInput,
    );
  });

  it("sets correct initial value", () => {
    expect(
      wrapper.findComponent(DateTimeInputBase).vm.modelValue,
    ).toStrictEqual(new Date(defaultProps.control.data));
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(DateTimeInput, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
