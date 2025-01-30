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

  const dummyTimeWithHours = (hours: number) => `2022-12-12T${hours}:22:22.000`;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: dummyTimeWithHours(20),
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

  it("sets correct initial value and calls changeValue when dateTime input is changed", () => {
    const modelValue = wrapper.findComponent(DateTimeInput).vm
      .modelValue as Date;
    expect(modelValue.toISOString()).toBe(`${dummyTimeWithHours(20)}Z`);
    const changedModelValue = new Date(modelValue.setUTCHours(21));
    expect(changedModelValue.toISOString()).toBe(`${dummyTimeWithHours(21)}Z`);
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", changedModelValue);
    expect(changeValue).toHaveBeenCalledWith(dummyTimeWithHours(21));
  });
});
