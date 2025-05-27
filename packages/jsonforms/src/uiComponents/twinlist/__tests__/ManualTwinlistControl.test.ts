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

import { Twinlist } from "@knime/components";

import {
  type ProvidedMethods,
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import { mergeDeep } from "../../../utils";
import ManualTwinlistControl from "../ManualTwinlistControl.vue";

describe("ManualTwinlistControl.vue", () => {
  let props: VueControlTestProps<typeof ManualTwinlistControl>;

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      labelForId,
      disabled: false,
      isValid: false,
      control: {
        ...getControlBase("test"),
        data: {
          manuallySelected: ["test_1"],
          manuallyDeselected: ["test_2", "test_3"],
          includeUnknownColumns: true,
        },
        schema: {
          type: "object",
          properties: {
            manuallySelected: {
              items: {
                type: "string",
              },
              type: "array",
            },
            manuallyDeselected: {
              items: {
                type: "string",
              },
              type: "array",
            },
            includeUnknownColumns: {
              type: "boolean",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/test",
          options: {
            format: "manualTwinlist",
            possibleValues: [
              {
                id: "test_1",
                text: "test_1",
                type: {
                  id: "StringValue",
                  text: "String",
                },
              },
              {
                id: "test_2",
                text: "test_2",
                type: {
                  id: "DoubleValue",
                  text: "Double",
                },
              },
              {
                id: "test_3",
                text: "test_3",
                type: {
                  id: "StringValue",
                  text: "String",
                },
              },
            ],
          },
        },
      },
    };
  });

  let wrapper: VueWrapper, changeValue: Mock;

  const mountManualTwinlistControl = ({
    provide,
  }: {
    provide?: Partial<ProvidedMethods>;
  } = {}) => {
    return mountJsonFormsControlLabelContent(ManualTwinlistControl, {
      props,
      provide,
    });
  };

  beforeEach(() => {
    const component = mountManualTwinlistControl();
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(Twinlist).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(Twinlist).attributes().id).toBe(labelForId);
  });

  it("calls changeValue when twinlist input is changed", async () => {
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(changeValue).toHaveBeenCalled();
  });

  describe("handles changes", () => {
    it("handles array manual selection values change", () => {
      const selected = ["A", "B", "C"];
      wrapper.findComponent(Twinlist).vm.$emit("update:modelValue", selected);
      expect(changeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          manuallySelected: selected,
        }),
      );
    });

    it("handles object manual selection values change", () => {
      const selected = ["A", "B", "C"];
      const deselected = ["E", "F", "G"];
      const includeUnknownValues = true;
      wrapper.findComponent(Twinlist).vm.$emit("update:modelValue", {
        includedValues: selected,
        excludedValues: deselected,
        includeUnknownValues,
      });
      expect(changeValue).toHaveBeenCalledWith({
        manuallySelected: selected,
        manuallyDeselected: deselected,
        includeUnknownColumns: includeUnknownValues,
      });
    });
  });

  it("correctly transforms the data into possible values", () => {
    expect(wrapper.findComponent(Twinlist).props().possibleValues).toEqual([
      {
        id: "test_1",
        text: "test_1",
        type: {
          id: "StringValue",
          text: "String",
        },
      },
      {
        id: "test_2",
        text: "test_2",
        type: {
          id: "DoubleValue",
          text: "Double",
        },
      },
      {
        id: "test_3",
        text: "test_3",
        type: {
          id: "StringValue",
          text: "String",
        },
      },
    ]);
  });

  describe("unknown columns", () => {
    it("excludes unknown columns without emitting an update", async () => {
      props = mergeDeep(props, {
        control: {
          data: {
            includeUnknownColumns: false,
            manuallySelected: ["A", "B"],
            manuallyDeselected: ["C", "D"],
          },
          uischema: {
            options: {
              possibleValues: [
                { id: "B", text: "B" },
                { id: "D", text: "D" },
                { id: "E", text: "E" },
              ],
            },
          },
        },
      });

      const { wrapper, changeValue } = mountManualTwinlistControl();
      await flushPromises();
      const manuallySelected = ["A", "B"];
      expect(changeValue).not.toHaveBeenCalled();
      expect(wrapper.findComponent(Twinlist).props().modelValue).toStrictEqual({
        includedValues: manuallySelected,
        excludedValues: ["C", "D", "E"],
        includeUnknownValues: false,
      });
    });

    it("includes unknown columns without emitting an update", async () => {
      props = mergeDeep(props, {
        control: {
          data: {
            includeUnknownColumns: true,
            manuallySelected: ["A", "B"],
            manuallyDeselected: ["C", "D"],
          },
          uischema: {
            options: {
              possibleValues: [
                { id: "B", text: "B" },
                { id: "D", text: "D" },
                { id: "E", text: "E" },
              ],
            },
          },
        },
      });
      const { wrapper, changeValue } = mountManualTwinlistControl();
      await flushPromises();
      const manuallySelected = ["A", "B", "E"];
      expect(changeValue).not.toHaveBeenCalled();
      expect(wrapper.findComponent(Twinlist).props().modelValue).toStrictEqual(
        expect.objectContaining({ includedValues: manuallySelected }),
      );
    });
  });

  it("moves missing values correctly", async () => {
    props.control.data = {
      manuallySelected: ["missing"],
      manuallyDeselected: ["test_1", "test_2", "test_3"],
      includeUnknownColumns: false,
    };
    const { wrapper, changeValue } = mountManualTwinlistControl();
    await flushPromises();
    expect(wrapper.vm.control.data).toMatchObject({
      manuallySelected: ["missing"],
    });
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllLeft" })
      .trigger("click");
    expect(changeValue).toBeCalledWith({
      manuallySelected: [],
      manuallyDeselected: ["test_1", "test_2", "test_3"],
      includeUnknownColumns: false,
    });
  });

  describe("left and right label", () => {
    it("passes the labels given by the uischema options to the twinlist if available", async () => {
      const includedLabel = "includedLabelLeft";
      const excludedLabel = "excludedLabelRight";
      props.control.uischema.options!.includedLabel = includedLabel;
      props.control.uischema.options!.excludedLabel = excludedLabel;
      const { wrapper } = await mountManualTwinlistControl();
      expect(wrapper.findComponent(Twinlist).props("leftLabel")).toBe(
        excludedLabel,
      );
      expect(wrapper.findComponent(Twinlist).props("rightLabel")).toBe(
        includedLabel,
      );
    });

    it("passes the labels given by the props if uischema options are not available", () => {
      expect(wrapper.findComponent(Twinlist).props("leftLabel")).toBe(
        "Excludes",
      );
      expect(wrapper.findComponent(Twinlist).props("rightLabel")).toBe(
        "Includes",
      );
    });
  });

  it("uses choicesProvider if present", async () => {
    props.control.uischema.providedOptions = ["possibleValues"];

    let provideChoices: (choices: unknown) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountManualTwinlistControl({
      provide: { addStateProviderListener },
    });
    expect(addStateProviderListener).toHaveBeenCalledWith(
      { providedOptionName: "possibleValues", scope: "#/properties/test" },
      expect.anything(),
    );
    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
      },
    ];
    provideChoices!(providedChoices);
    await flushPromises();
    expect(
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
