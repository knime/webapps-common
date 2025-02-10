/* eslint-disable max-lines */
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

import { MultiModeTwinList, Twinlist } from "@knime/components";

import {
  type ProvidedMethods,
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import { mergeDeep } from "../../../utils";
import TwinlistControl from "../MultimodeTwinlistControl.vue";

describe("TwinlistControl.vue", () => {
  let props: VueControlTestProps<typeof TwinlistControl>;

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      labelForId,
      disabled: false,
      isValid: false,
      control: {
        ...getControlBase("test"),
        data: {
          selected: ["test_1"],
          manualFilter: {
            manuallySelected: ["test_1"],
            manuallyDeselected: ["test_2", "test_3"],
            includeUnknownColumns: true,
          },
          patternFilter: {
            isCaseSensitive: false,
            isInverted: false,
            pattern: "",
          },
          typeFilter: {
            selectedTypes: ["StringValue", "IntValue"],
            typeDisplays: [{ id: "StringValue", text: "String" }],
          },
          mode: "MANUAL",
        },
        schema: {
          type: "object",
          properties: {
            patternFilter: {
              type: "object",
              properties: {
                isCaseSensitive: {
                  type: "boolean",
                },
                isInverted: {
                  type: "boolean",
                },
                pattern: {
                  type: "string",
                },
              },
            },
            manualFilter: {
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
            typeFilter: {
              type: "object",
              properties: {
                selectedTypes: {
                  items: {
                    type: "string",
                  },
                  type: "array",
                },
                typeDisplays: {
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      text: {
                        type: "string",
                      },
                    },
                  },
                  type: "array",
                },
              },
            },
            mode: {
              oneOf: [
                {
                  const: "MANUAL",
                  title: "Manual",
                },
                {
                  const: "REGEX",
                  title: "Regex",
                },
                {
                  const: "WILDCARD",
                  title: "Wildcard",
                },
                {
                  const: "TYPE",
                  title: "Type",
                },
              ],
            },
            selected: {
              type: "array",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/test",
          options: {
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

  const mountTwinlistControl = ({
    provide,
  }: {
    provide?: Partial<ProvidedMethods>;
  } = {}) => {
    return mountJsonFormsControlLabelContent(TwinlistControl, {
      props,
      provide,
    });
  };

  beforeEach(() => {
    const component = mountTwinlistControl();
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(MultiModeTwinList).exists()).toBe(true);
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
    it("handles selected values change", async () => {
      const selected = ["A", "B", "C"];
      await wrapper
        .findComponent(MultiModeTwinList)
        .vm.$emit("update:selected", selected);
      expect(changeValue).toHaveBeenCalledWith(
        expect.objectContaining({ selected }),
      );
    });

    it("handles array manual selection values change", () => {
      const selected = ["A", "B", "C"];
      wrapper
        .findComponent(MultiModeTwinList)
        .vm.$emit("update:manualSelection", selected);
      expect(changeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          manualFilter: expect.objectContaining({
            manuallySelected: selected,
          }),
        }),
      );
    });

    it("handles object manual selection values change", () => {
      const selected = ["A", "B", "C"];
      const deselected = ["E", "F", "G"];
      const includeUnknownValues = true;
      wrapper
        .findComponent(MultiModeTwinList)
        .vm.$emit("update:manualSelection", {
          includedValues: selected,
          excludedValues: deselected,
          includeUnknownValues,
        });
      expect(changeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          manualFilter: {
            manuallySelected: selected,
            manuallyDeselected: deselected,
            includeUnknownColumns: includeUnknownValues,
          },
        }),
      );
    });

    it("handles pattern change", () => {
      const pattern = "abc";
      wrapper
        .findComponent(MultiModeTwinList)
        .vm.$emit("update:pattern", pattern);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ pattern }),
        }),
      );
    });

    it("handles isInverted change", () => {
      const isInverted = true;
      wrapper
        .findComponent(MultiModeTwinList)
        .vm.$emit("update:inversePattern", isInverted);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ isInverted }),
        }),
      );
    });

    it("handles isCaseSensitive change", () => {
      const isCaseSensitive = true;
      wrapper
        .findComponent(MultiModeTwinList)
        .vm.$emit("update:caseSensitivePattern", isCaseSensitive);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ isCaseSensitive }),
        }),
      );
    });

    it("handles type selection change", () => {
      const selectedTypes = ["A", "B", "C"];
      const typeDisplays = [
        { id: "A", text: "Text A" },
        { id: "B", text: "Text B" },
        { id: "C", text: "Text C" },
      ];
      wrapper
        .findComponent(MultiModeTwinList)
        .vm.$emit("update:selected-types", selectedTypes, typeDisplays);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          typeFilter: expect.objectContaining({ selectedTypes, typeDisplays }),
        }),
      );
    });
  });

  it("correctly transforms the data into possible values", () => {
    expect(
      wrapper.findComponent(MultiModeTwinList).props().possibleValues,
    ).toEqual([
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

  it("correctly determines previously selected types", () => {
    expect(
      wrapper.findComponent(MultiModeTwinList).props().additionalPossibleTypes,
    ).toEqual([
      {
        id: "StringValue",
        text: "String",
      },
      {
        id: "IntValue",
        text: "IntValue",
      },
    ]);
  });

  describe("unknown columns", () => {
    it("excludes unknown columns without emitting an update", async () => {
      props = mergeDeep(props, {
        showUnknownValues: true,
        control: {
          data: {
            manualFilter: {
              includeUnknownColumns: false,
              manuallySelected: ["A", "B"],
              manuallyDeselected: ["C", "D"],
            },
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

      const { wrapper, changeValue } = mountTwinlistControl();
      await flushPromises();
      const manuallySelected = ["A", "B"];
      expect(changeValue).not.toHaveBeenCalled();
      expect(
        wrapper.findComponent(MultiModeTwinList).props().manualSelection,
      ).toStrictEqual({
        includedValues: manuallySelected,
        excludedValues: ["C", "D", "E"],
        includeUnknownValues: false,
      });
    });

    it("includes unknown columns without emitting an update", async () => {
      props = mergeDeep(props, {
        control: {
          data: {
            manualFilter: {
              includeUnknownColumns: true,
              manuallySelected: ["A", "B"],
              manuallyDeselected: ["C", "D"],
            },
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
      const { wrapper, changeValue } = mountTwinlistControl();
      await flushPromises();
      const manuallySelected = ["A", "B", "E"];
      expect(changeValue).not.toHaveBeenCalled();
      expect(
        wrapper.findComponent(MultiModeTwinList).props().manualSelection,
      ).toStrictEqual(manuallySelected);
    });
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(MultiModeTwinList).props().pattern).toBe(
      props.control.data.patternFilter.pattern,
    );
    expect(
      wrapper.findComponent(MultiModeTwinList).props().selectedTypes,
    ).toStrictEqual(props.control.data.typeFilter?.selectedTypes);
    expect(
      wrapper.findComponent(MultiModeTwinList).props().manualSelection,
    ).toStrictEqual(props.control.data.manualFilter.manuallySelected);
    expect(wrapper.findComponent(MultiModeTwinList).props().mode).toBe(
      "manual",
    );
  });

  it("moves missing values correctly", async () => {
    props.control.data.manualFilter = {
      manuallySelected: ["missing"],
      manuallyDeselected: ["test_1", "test_2", "test_3"],
      includeUnknownColumns: false,
    };
    const { wrapper, changeValue } = mountTwinlistControl();
    await flushPromises();
    expect(wrapper.vm.control.data.manualFilter).toMatchObject({
      manuallySelected: ["missing"],
    });
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllLeft" })
      .trigger("click");
    expect(changeValue).toBeCalledWith(
      expect.objectContaining({
        manualFilter: {
          manuallySelected: [],
          manuallyDeselected: ["test_1", "test_2", "test_3"],
          includeUnknownColumns: false,
        },
      }),
    );
  });

  describe("left and right label", () => {
    it("passes the labels given by the uischema options to the twinlist if available", async () => {
      const includedLabel = "includedLabelLeft";
      const excludedLabel = "excludedLabelRight";
      props.control.uischema.options!.includedLabel = includedLabel;
      props.control.uischema.options!.excludedLabel = excludedLabel;
      const { wrapper } = await mountTwinlistControl();
      // @ts-expect-error Property 'leftLabel' does not exist on type
      expect(wrapper.vm.leftLabel).toBe(excludedLabel);
      // @ts-expect-error Property 'rightLabel' does not exist on type
      expect(wrapper.vm.rightLabel).toBe(includedLabel);
    });

    it("passes the labels given by the props if uischema options are not available", () => {
      // @ts-expect-error Property 'leftLabel' does not exist on type
      expect(wrapper.vm.leftLabel).toBe("Excludes");
      // @ts-expect-error Property 'rightLabel' does not exist on type
      expect(wrapper.vm.rightLabel).toBe("Includes");
    });
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options!.choicesProvider = choicesProvider;

    let provideChoices: (choices: unknown) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountTwinlistControl({
      provide: { addStateProviderListener },
    });
    expect(addStateProviderListener).toHaveBeenCalledWith(
      { id: choicesProvider },
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
