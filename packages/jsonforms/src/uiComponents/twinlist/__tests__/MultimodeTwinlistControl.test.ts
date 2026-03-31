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

import { KdsTwinList } from "@knime/kds-components";

import {
  type ProvidedMethods,
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import { mergeDeep } from "../../../utils";
import TwinlistControl from "../MultimodeTwinlistControl.vue";

describe("TwinlistControl", () => {
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
    expect(wrapper.findComponent(KdsTwinList).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(KdsTwinList).attributes().id).toBe(labelForId);
  });

  it("calls changeValue when twinlist input is changed", async () => {
    wrapper
      .findComponent(KdsTwinList)
      .vm.$emit("update:manuallyIncluded", ["test_1", "test_2", "test_3"]);
    await flushPromises();
    expect(changeValue).toHaveBeenCalled();
  });

  describe("handles changes", () => {
    it("handles manual selection included change", async () => {
      const selected = ["A", "B", "C"];
      wrapper
        .findComponent(KdsTwinList)
        .vm.$emit("update:manuallyIncluded", selected);
      await flushPromises();
      expect(changeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          manualFilter: expect.objectContaining({
            manuallySelected: selected,
          }),
        }),
      );
    });

    it("handles manual selection excluded change", async () => {
      const deselected = ["E", "F", "G"];
      wrapper
        .findComponent(KdsTwinList)
        .vm.$emit("update:manuallyExcluded", deselected);
      await flushPromises();
      expect(changeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          manualFilter: expect.objectContaining({
            manuallyDeselected: deselected,
          }),
        }),
      );
    });

    it("handles pattern change", () => {
      const pattern = "abc";
      wrapper.findComponent(KdsTwinList).vm.$emit("update:pattern", pattern);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ pattern }),
        }),
      );
    });

    it("handles excludeMatches (isInverted) change", () => {
      const isInverted = true;
      wrapper
        .findComponent(KdsTwinList)
        .vm.$emit("update:excludeMatches", isInverted);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ isInverted }),
        }),
      );
    });

    it("handles caseSensitive change", () => {
      const isCaseSensitive = true;
      wrapper
        .findComponent(KdsTwinList)
        .vm.$emit("update:caseSensitive", isCaseSensitive);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ isCaseSensitive }),
        }),
      );
    });

    it("handles type selection change", () => {
      props.showTypeFilter = true;
      const { wrapper, changeValue } = mountTwinlistControl();
      const selectedTypes = ["StringValue", "DoubleValue"];
      wrapper
        .findComponent(KdsTwinList)
        .vm.$emit("update:selectedTypes", selectedTypes);
      expect(changeValue).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          typeFilter: expect.objectContaining({ selectedTypes }),
        }),
      );
    });
  });

  it("correctly transforms the data into possible values with accessory", () => {
    const possibleValues = wrapper
      .findComponent(KdsTwinList)
      .props().possibleValues;
    expect(possibleValues).toEqual([
      {
        id: "test_1",
        text: "test_1",
        type: "StringValue",
        accessory: { type: "dataType", name: "StringValue" },
      },
      {
        id: "test_2",
        text: "test_2",
        type: "DoubleValue",
        accessory: { type: "dataType", name: "DoubleValue" },
      },
      {
        id: "test_3",
        text: "test_3",
        type: "StringValue",
        accessory: { type: "dataType", name: "StringValue" },
      },
    ]);
  });

  it("correctly provides filterTypes when showTypeFilter is true", () => {
    props.showTypeFilter = true;
    const { wrapper } = mountTwinlistControl();
    const filterTypes = wrapper.findComponent(KdsTwinList).props().filterTypes;
    // Should contain types from possibleValues + previously selected types
    expect(filterTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "StringValue", text: "String" }),
        expect.objectContaining({ id: "DoubleValue", text: "Double" }),
        expect.objectContaining({ id: "IntValue", text: "IntValue" }),
      ]),
    );
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
        wrapper.findComponent(KdsTwinList).props().manuallyIncluded,
      ).toStrictEqual(manuallySelected);
      expect(
        wrapper.findComponent(KdsTwinList).props().manuallyExcluded,
      ).toStrictEqual(["C", "D", "E"]);
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
        wrapper.findComponent(KdsTwinList).props().manuallyIncluded,
      ).toStrictEqual(manuallySelected);
    });
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(KdsTwinList).props().pattern).toBe(
      props.control.data.patternFilter.pattern,
    );
    expect(
      wrapper.findComponent(KdsTwinList).props().selectedTypes,
    ).toStrictEqual(props.control.data.typeFilter?.selectedTypes);
    expect(
      wrapper.findComponent(KdsTwinList).props().manuallyIncluded,
    ).toStrictEqual(props.control.data.manualFilter.manuallySelected);
    expect(wrapper.findComponent(KdsTwinList).props().mode).toBe("manual");
  });

  it("moves missing values correctly", async () => {
    props.control.data.manualFilter = {
      manuallySelected: ["missing"],
      manuallyDeselected: ["test_1", "test_2", "test_3"],
      includeUnknownColumns: false,
    };
    const { wrapper, changeValue } = mountTwinlistControl();
    await flushPromises();
    expect((wrapper.vm as any).control.data.manualFilter).toMatchObject({
      manuallySelected: ["missing"],
    });
    wrapper.findComponent(KdsTwinList).vm.$emit("update:manuallyIncluded", []);
    wrapper
      .findComponent(KdsTwinList)
      .vm.$emit("update:manuallyExcluded", ["test_1", "test_2", "test_3"]);
    await flushPromises();
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
    props.control.uischema.providedOptions = ["possibleValues"];

    let provideChoices: (choices: unknown) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountTwinlistControl({
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
      wrapper.findComponent(KdsTwinList).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });

  it("maps mode correctly to KdsTwinList", () => {
    expect(wrapper.findComponent(KdsTwinList).props().mode).toBe("manual");

    props.control.data.mode = "WILDCARD";
    const { wrapper: w2 } = mountTwinlistControl();
    expect(w2.findComponent(KdsTwinList).props().mode).toBe("pattern");
    expect(w2.findComponent(KdsTwinList).props().useRegex).toBe(false);

    props.control.data.mode = "REGEX";
    const { wrapper: w3 } = mountTwinlistControl();
    expect(w3.findComponent(KdsTwinList).props().mode).toBe("pattern");
    expect(w3.findComponent(KdsTwinList).props().useRegex).toBe(true);

    props.control.data.mode = "TYPE";
    const { wrapper: w4 } = mountTwinlistControl();
    expect(w4.findComponent(KdsTwinList).props().mode).toBe("type");
  });
});
