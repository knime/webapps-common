import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { DateTimeInput } from "@knime/components/date-time-input";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import DateControl from "../DateControl.vue";
import DateTimeControl from "../DateTimeControl.vue";
import DialogLabel from "../label/DialogLabel.vue";
import LabeledControl from "../label/LabeledControl.vue";

describe("DateControl.vue", () => {
  let defaultProps, wrapper, component;

  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

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

    component = mountJsonFormsComponent(DateControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(DateControl).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(DateTimeInput).exists()).toBe(true);
  });

  it("sets labelForId", async () => {
    await wrapper.vm.$nextTick();
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(DateTimeInput).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when text input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, handleChange } = mountJsonFormsComponent(DateControl, {
      props: defaultProps,
      provide: { setDirtyModelSettingsMock },
    });
    const changedDateTimeInput = new Date("2022-12-12T20:22:22.000Z");
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(handleChange).toHaveBeenCalledWith(
      defaultProps.control.path,
      changedDateTimeInput,
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(DateTimeInput).vm.modelValue).toStrictEqual(
      new Date(defaultProps.control.data),
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(DateTimeControl, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
