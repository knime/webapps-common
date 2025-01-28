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
import flushPromises from "flush-promises";

import { IntervalInput } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import IntervalControl from "../IntervalControl.vue";

describe("IntervalControl.vue", () => {
  let props: VueControlTestProps<typeof IntervalControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "myLabelForId";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("path"),
        data: "P1Y",
        schema: {
          properties: {
            maxRows: {
              type: "integer",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: "integer",
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: false,
    };
    const component = await mountJsonFormsControlLabelContent(IntervalControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      compact: true,
      disabled: false,
      modelValue: props.control.data,
      format: "DATE_OR_TIME",
    });
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(IntervalInput).attributes().id).toBe(
      labelForId,
    );
  });

  it("calls changeValue when interval input is changed", () => {
    const changedInterval = "P2Y";
    wrapper
      .findComponent(IntervalInput)
      .vm.$emit("update:modelValue", changedInterval);
    expect(changeValue).toHaveBeenCalledWith(changedInterval);
  });

  it("uses format from options", () => {
    props.control.uischema.options!.intervalType = "DATE";
    const { wrapper } = mountJsonFormsControlLabelContent(IntervalControl, {
      props,
    });
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      format: "DATE",
    });
  });

  it("uses format from provider in options", async () => {
    const intervalTypeProvider = "myProvider";
    props.control.uischema.options!.intervalTypeProvider = intervalTypeProvider;
    let provideIntervalType: (intervalType: string) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideIntervalType = callback;
    });
    const { wrapper } = mountJsonFormsControlLabelContent(IntervalControl, {
      props,
      provide: { addStateProviderListener },
    });
    expect(addStateProviderListener).toHaveBeenCalledWith(
      { id: intervalTypeProvider },
      expect.anything(),
    );
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      format: "DATE_OR_TIME",
    });
    const providedIntervalType = "DATE";

    provideIntervalType!(providedIntervalType);
    await flushPromises();
    expect(wrapper.getComponent(IntervalInput).props()).toMatchObject({
      format: "DATE",
    });
  });
});
