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

  const dummyTimeWithHours = (hours: number) => `2022-12-12T${hours}:22:22.000`;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: {
          dateTime: dummyTimeWithHours(20),
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
      isValid: false,
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

  it("sets correct initial value and calls changeValue when dateTime input is changed", () => {
    const modelValue = wrapper.findComponent(DateTimeInput).vm
      .modelValue as Date;
    expect(modelValue.toISOString()).toBe(`${dummyTimeWithHours(20)}Z`);
    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(
      props.control.data.timeZone,
    );
    const changedModelValue = new Date(modelValue.setUTCHours(21));
    expect(changedModelValue.toISOString()).toBe(`${dummyTimeWithHours(21)}Z`);
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", changedModelValue);
    expect(changeValue).toHaveBeenCalledWith({
      dateTime: dummyTimeWithHours(21),
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

  it("disables both controls when disabled", async () => {
    await wrapper.setProps({ disabled: true });
    expect(wrapper.findComponent(DateTimeInput).props("disabled")).toBe(true);
    expect(wrapper.findComponent(Dropdown).props("disabled")).toBe(true);
  });
});
