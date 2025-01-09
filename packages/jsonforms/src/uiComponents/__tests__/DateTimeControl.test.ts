import {
  type Mock,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { DateTimeInput } from "@knime/components/date-time-input";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import DateTimeControl from "../DateTimeControl.vue";

describe("DateTimeInput.vue", () => {
  let props: VueControlTestProps<typeof DateTimeControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
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
      labelForId,
      disabled: false,
    };

    const component = mountJsonFormsControlLabelContent(DateTimeControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(DateTimeInput).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(DateTimeInput).props().id).toBe(labelForId);
  });

  it("calls changeValue when dateTime input is changed", () => {
    const changedDateTimeInput = new Date("2022-12-12T20:22:22.000Z");
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(changeValue).toHaveBeenCalledWith(changedDateTimeInput);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(DateTimeInput).vm.modelValue).toStrictEqual(
      new Date(props.control.data),
    );
  });
});
