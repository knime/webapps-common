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

import { Dropdown } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import type { PossibleValue } from "../../types/ChoicesUiSchema";
import type { Control } from "../../types/Control";
import ColumnSelect from "../ColumnSelect.vue";

describe("ColumnSelect.vue", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof ColumnSelect>,
    path: string,
    changeValue: Mock;

  const getPossibleValuesFromUiSchema = vi.fn((control: Control) =>
    Promise.resolve(control.uischema.options!.possibleValues),
  );

  beforeEach(() => {
    path = "control path mock";
    props = {
      control: {
        ...getControlBase(path),
        data: {
          selected: "Universe_0_0",
        },
        schema: {
          type: "object",
          properties: {
            selected: {
              type: "array",
            },
          },
          title: "Y Axis Column",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/yAxisColumn",
          options: {
            format: "columnSelection",
            showRowKeys: false,
            showNoneColumn: false,
            possibleValues: [
              {
                id: "Universe_0_0",
                text: "Universe_0_0",
                compatibleTypes: ["Type_0_0", "OtherType_0_0"],
              },
              {
                id: "Universe_0_1",
                text: "Universe_0_1",
                compatibleTypes: ["Type_0_1", "OtherType_0_1"],
              },
              {
                id: "Universe_1_0",
                text: "Universe_1_0",
                compatibleTypes: ["Type_1_0", "OtherType_1_0"],
              },
              {
                id: "Universe_1_1",
                text: "Universe_1_1",
                compatibleTypes: ["Type_1_1", "OtherType_1_1"],
              },
            ],
          },
        },
      },
      disabled: false,
      isValid: false,
      messages: { errors: [] },
    };
    const component = mountJsonFormsControl(ColumnSelect, {
      props,
      provide: {
        // @ts-expect-error Argument of type ... is not assignable to parameter of type 'VueControl<unknown>'.
        getPossibleValuesFromUiSchema,
      },
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  describe("compatible types", () => {
    it("updates compatible types when mounted", () => {
      expect(changeValue).toHaveBeenCalledWith({
        selected: "Universe_0_0",
        compatibleTypes: ["Type_0_0", "OtherType_0_0"],
      });
    });

    it("updates compatible types on value change", () => {
      const dropdownControl = wrapper.findComponent({
        name: "DropdownControl",
      });
      const dropdown = dropdownControl.findComponent(Dropdown);
      dropdown.vm.$emit("update:modelValue", "Universe_1_1");
      expect(changeValue).toHaveBeenNthCalledWith(2, {
        selected: "Universe_1_1",
        compatibleTypes: ["Type_1_1", "OtherType_1_1"],
      });
    });

    it("sets empty compatible types on missing value", () => {
      const dropdownControl = wrapper.findComponent({
        name: "DropdownControl",
      });
      const dropdown = dropdownControl.findComponent(Dropdown);
      dropdown.vm.$emit("update:modelValue", "I am Missing");
      expect(changeValue).toHaveBeenNthCalledWith(2, {
        selected: "I am Missing",
        compatibleTypes: [],
      });
    });
  });

  describe("optionsGenerator", () => {
    it("optionsGenerator correctly transforms the data", async () => {
      expect(
        await wrapper.getComponent({ name: "DropdownControl" }).props()
          .asyncInitialOptions,
      ).toEqual([
        expect.objectContaining({
          id: "Universe_0_0",
          text: "Universe_0_0",
        }),
        expect.objectContaining({
          id: "Universe_0_1",
          text: "Universe_0_1",
        }),
        expect.objectContaining({
          id: "Universe_1_0",
          text: "Universe_1_0",
        }),
        expect.objectContaining({
          id: "Universe_1_1",
          text: "Universe_1_1",
        }),
      ]);
    });

    it.skip("optionsGenerator correctly transforms the data with none column and row keys", async () => {
      props.control.uischema.options!.showNoneColumn = true;
      props.control.uischema.options!.showRowKeys = true;
      props.control.uischema.options!.showRowNumbers = true;

      const { wrapper } = mountJsonFormsControl(ColumnSelect, {
        props,
        provide: {
          // @ts-expect-error Argument of type ... is not assignable to parameter of type 'VueControl<unknown>'.
          getPossibleValuesFromUiSchema,
        },
      });

      expect(
        await wrapper.getComponent({ name: "DropdownControl" }).props()
          .asyncInitialOptions,
      ).toEqual([
        expect.objectContaining({
          id: "<none>",
          text: "None",
        }),
        expect.objectContaining({
          id: "<row-keys>",
          text: "RowID",
        }),
        expect.objectContaining({
          id: "<row-numbers>",
          text: "Row number",
        }),
        expect.objectContaining({
          id: "Universe_0_0",
          text: "Universe_0_0",
        }),
        expect.objectContaining({
          id: "Universe_0_1",
          text: "Universe_0_1",
        }),
        expect.objectContaining({
          id: "Universe_1_0",
          text: "Universe_1_0",
        }),
        expect.objectContaining({
          id: "Universe_1_1",
          text: "Universe_1_1",
        }),
      ]);
    });
  });

  it("throws an error when trying to convert settings before the options are loaded", () => {
    const { wrapper } = mountJsonFormsControl(ColumnSelect, {
      props,
      provide: {
        // @ts-expect-error Argument of type ... is not assignable to parameter of type 'VueControl<unknown>'.
        getPossibleValuesFromUiSchema,
      },
    });
    expect(() =>
      wrapper.getComponent({ name: "DropdownControl" }).props()
        .dropdownValueToControlData!("Value"),
    ).toThrowError("Must not convert data before column choices are fetched.");
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options!.choicesProvider = choicesProvider;

    let provideChoices: (choices: PossibleValue[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsControl(ColumnSelect, {
      props,
      provide: {
        addStateProviderListener,
        // @ts-expect-error Argument of type ... is not assignable to parameter of type 'VueControl<unknown>'.
        getPossibleValuesFromUiSchema,
      },
    });
    expect(addStateProviderListener).toHaveBeenCalledWith(
      { id: choicesProvider },
      expect.anything(),
    );
    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
        compatibleTypes: ["Type_0_0", "OtherType_0_0"],
      },
    ];
    provideChoices!(providedChoices);
    expect(
      await wrapper.getComponent({ name: "DropdownControl" }).props()
        .asyncInitialOptions,
    ).toStrictEqual(providedChoices);
  });
});
