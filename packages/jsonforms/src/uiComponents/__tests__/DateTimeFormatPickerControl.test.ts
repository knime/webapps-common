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
import { flushPromises } from "@vue/test-utils";

import {
  type KdsDateTimeFormatEntry,
  KdsDateTimeFormatInput,
} from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils";
import DateTimeFormatPickerControl from "../DateTimeFormatPickerControl.vue";

describe("DateTimeFormatPickerControl", () => {
  let props: VueControlTestProps<typeof DateTimeFormatPickerControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "myLabelForId";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("path"),
        data: "yyyy-MM-dd",
        schema: {
          properties: {
            path: {
              type: "string",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: "dateTimeFormat",
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: false,
    };
    const component = await mountJsonFormsControlLabelContent(
      DateTimeFormatPickerControl,
      {
        props,
      },
    );
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(KdsDateTimeFormatInput).props()).toMatchObject({
      disabled: false,
      modelValue: props.control.data,
    });
  });

  it("sets labelForId", () => {
    expect(wrapper.find(`#${labelForId}`).exists()).toBeTruthy();
  });

  it("calls changeValue when format input is changed", () => {
    const changedFormat = "QQQ";
    wrapper
      .findComponent(KdsDateTimeFormatInput)
      .vm.$emit("update:modelValue", changedFormat);
    expect(changeValue).toHaveBeenCalledWith(changedFormat);
  });

  it("uses format from provider in options", async () => {
    props.control.uischema.providedOptions = ["dateTimeFormats"];
    let provideFormats: (formats: KdsDateTimeFormatEntry[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideFormats = callback;
    });
    const { wrapper } = mountJsonFormsControlLabelContent(
      DateTimeFormatPickerControl,
      {
        props,
        provide: { addStateProviderListener },
      },
    );
    expect(addStateProviderListener).toHaveBeenCalledWith(
      {
        providedOptionName: "dateTimeFormats",
        scope: "#/properties/view/properties/maxRows",
      },
      expect.anything(),
    );
    expect(wrapper.getComponent(KdsDateTimeFormatInput).props()).toMatchObject({
      allDefaultFormats: [],
    });

    const formatsToProvide: KdsDateTimeFormatEntry[] = [
      {
        format: "yy-yyyy",
        temporalType: "DATE",
        category: "EUROPEAN",
        example: "21-2021",
      },
    ];

    provideFormats!(formatsToProvide);
    await flushPromises();
    expect(wrapper.getComponent(KdsDateTimeFormatInput).props()).toMatchObject({
      allDefaultFormats: formatsToProvide,
    });
  });
});
