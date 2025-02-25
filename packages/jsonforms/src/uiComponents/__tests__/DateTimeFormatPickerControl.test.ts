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

import { DateTimeFormatInput, type FormatWithExample } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import DateTimeFormatPickerControl from "../DateTimeFormatPickerControl.vue";

describe("DateTimeFormatPickerControl.vue", () => {
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
    expect(wrapper.getComponent(DateTimeFormatInput).props()).toMatchObject({
      compact: true,
      disabled: false,
      modelValue: {
        format: props.control.data,
        temporalType: expect.any(String),
      },
    });
  });

  it("sets labelForId", () => {
    expect(wrapper.find(`#${labelForId}`).exists()).toBeTruthy();
  });

  it("calls changeValue when format input is changed", () => {
    const changedFormat = {
      format: "QQQ",
      temporalType: "DATE",
    };
    wrapper
      .findComponent(DateTimeFormatInput)
      .vm.$emit("update:modelValue", changedFormat);
    expect(changeValue).toHaveBeenCalledWith(changedFormat.format);
  });

  it("uses format from provider in options", async () => {
    const formatTypeProvider = "myProvider";
    props.control.uischema.options!.formatProvider = formatTypeProvider;
    let provideFormats: (formats: FormatWithExample[]) => void;
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
      { id: formatTypeProvider },
      expect.anything(),
    );
    expect(wrapper.getComponent(DateTimeFormatInput).props()).toMatchObject({
      allDefaultFormats: null,
    });

    const formatsToProvide: FormatWithExample[] = [
      {
        format: "yy-yyyy",
        temporalType: "DATE",
        category: "EUROPEAN",
        example: "21-2021",
      },
    ];

    provideFormats!(formatsToProvide);
    await flushPromises();
    expect(wrapper.getComponent(DateTimeFormatInput).props()).toMatchObject({
      allDefaultFormats: formatsToProvide,
    });
  });
});
