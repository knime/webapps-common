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

import { Dropdown } from "@knime/components";
import { DateTimeInput } from "@knime/components/date-time-input";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import ZonedDateTimeControl from "../ZonedDateTimeControl.vue";

describe("ZonedDateTimeControl.vue", () => {
  let props: VueControlTestProps<typeof ZonedDateTimeControl>,
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
        data: {
          dateTime: "2022-12-12T20:22:22.000",
          timeZone: "Europe/Berlin",
        },
        schema: {
          properties: {
            zonedDateTime: {
              type: "string",
              format: "zonedDateTime",
              title: "date&time",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/zonedDateTime",
          options: {
            isAdvanced: false,
          },
        },
      },
      labelForId,
      disabled: false,
    };

    const component = mountJsonFormsControlLabelContent(ZonedDateTimeControl, {
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
    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.find("div").attributes("id")).toBe(labelForId);
  });

  it("calls changeValue when dateTime input is changed", () => {
    const changedDateTimeInputString = "2022-12-12T20:22:22.000Z";
    const changedDateTimeInput = new Date(changedDateTimeInputString);
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(changeValue).toHaveBeenCalledWith({
      dateTime: changedDateTimeInputString,
      timeZone: expect.anything(),
    });
  });

  it("calls changeValue when timeZone input is changed", () => {
    const changedTimeZone = "Europe/Paris";
    wrapper
      .findComponent(Dropdown)
      .vm.$emit("update:modelValue", changedTimeZone);
    expect(changeValue).toHaveBeenCalledWith({
      dateTime: expect.anything(),
      timeZone: changedTimeZone,
    });
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(DateTimeInput).vm.modelValue).toStrictEqual(
      new Date(props.control.data.dateTime),
    );
    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(
      props.control.data.timeZone,
    );
  });
});
