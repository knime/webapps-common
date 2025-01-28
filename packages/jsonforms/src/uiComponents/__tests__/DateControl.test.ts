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
import DateControl from "../DateControl.vue";

describe("DateControl.vue", () => {
  let props: VueControlTestProps<typeof DateControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "dateControlLabel";

  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  beforeEach(async () => {
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
      isValid: false,
    };

    const component = await mountJsonFormsControlLabelContent(DateControl, {
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
    expect(wrapper.findComponent(DateTimeInput).props().id).toBe(labelForId);
  });

  it("calls changeValue when date input is changed", () => {
    const newDateValue = new Date("2022-12-12T20:22:22.000Z");
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", newDateValue);
    expect(changeValue).toHaveBeenCalledWith(newDateValue);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(DateTimeInput).vm.modelValue).toStrictEqual(
      new Date(props.control.data),
    );
  });
});
