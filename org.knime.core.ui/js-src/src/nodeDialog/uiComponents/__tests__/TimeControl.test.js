import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import TimeControl from "../TimeControl.vue";
import LabeledControl from "../label/LabeledControl.vue";
import DialogLabel from "../label/DialogLabel.vue";
import { DateTimeInput } from "@knime/components/date-time-input";
import { localTimeUtils } from "@/nodeDialog/utils/localTimeUtils";

describe("TimeControl", () => {
  let wrapper, component;

  const defaultProps = {
    control: {
      ...getControlBase("test"),
      data: "2022-12-12T20:22:22.000Z",
      schema: {
        properties: {
          dateTime: {
            type: "string",
            format: "date-time",
            title: "Time",
          },
        },
        default: "default value",
      },
      uischema: {
        type: "Control",
        scope: "#/properties/view/properties/timeParts",
        options: {
          isAdvanced: false,
        },
      },
    },
  };

  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  beforeEach(() => {
    component = mountJsonFormsComponent(TimeControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(TimeControl).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(DateTimeInput).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);

    expect(wrapper.getComponent(DateTimeInput).props().id).toBe(
      dialogLabel.vm.labelForId,
    );

    expect(dialogLabel.vm.labeledElement).toBeDefined();
    // TODO(UIEXT-2259): The id is set on the Date part that is not used here
    // expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when text input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, handleChange } = mountJsonFormsComponent(TimeControl, {
      props: defaultProps,
      provide: { setDirtyModelSettingsMock },
    });
    const changedDateTimeInput = new Date("2022-12-12T20:22:22.000Z");
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(handleChange).toHaveBeenCalledWith(
      defaultProps.control.path,
      localTimeUtils.toString(changedDateTimeInput),
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct initial value", async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(DateTimeInput).vm.modelValue).toStrictEqual(
      localTimeUtils.fromString(defaultProps.control.data),
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(TimeControl, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
