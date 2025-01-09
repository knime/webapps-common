import {
  type Mock,
  afterEach,
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
import { localTimeUtils } from "../../utils/localTimeUtils";
import TimeControl from "../TimeControl.vue";

describe("TimeControl", () => {
  let props: VueControlTestProps<typeof TimeControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

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
      labelForId,
      disabled: false,
    };
    const component = mountJsonFormsControlLabelContent(TimeControl, {
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
    // TODO(UIEXT-2259): The id is set on the Date part that is not used here
  });

  it("calls changeValue when time input is changed", () => {
    const changedDateTimeInput = new Date("2022-12-12T20:22:22.000Z");
    wrapper
      .findComponent(DateTimeInput)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(changeValue).toHaveBeenCalledWith(
      localTimeUtils.toString(changedDateTimeInput),
    );
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(DateTimeInput).vm.modelValue).toStrictEqual(
      localTimeUtils.fromString(props.control.data),
    );
  });
});
