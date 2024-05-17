/* eslint-disable max-lines */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import TwinlistInput from "../TwinlistInput.vue";
import TwinlistLoadingInfo from "../../loading/TwinlistLoadingInfo.vue";
import LabeledInput from "../../label/LabeledInput.vue";
import DialogLabel from "../../label/DialogLabel.vue";
import MultiModeTwinlist from "webapps-common/ui/components/forms/MultiModeTwinlist.vue";
import Twinlist from "webapps-common/ui/components/forms/Twinlist.vue";
import MultiselectListBox from "webapps-common/ui/components/forms/MultiselectListBox.vue";
import { mergeDeep } from "@/nodeDialog/utils";
import flushPromises from "flush-promises";

describe("TwinlistInput.vue", () => {
  let props;

  beforeEach(() => {
    props = {
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
                  item: {
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

  let wrapper, component, handleChange;

  beforeEach(() => {
    component = mountJsonFormsComponent(TwinlistInput, { props });
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(TwinlistInput).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(MultiModeTwinlist).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(Twinlist).attributes().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("renders TwinlistLoadingInfo when the possible values are being loaded", async () => {
    delete props.control.uischema.options.possibleValues;
    props.control.uischema.options.choicesProviderClass =
      "dummyChoicesProvider";
    const asyncChoicesResult = [{ id: "id", text: "text" }];
    let resolveChoices;
    const asyncChoicesProviderMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveChoices = resolve;
      }),
    );
    const { wrapper } = mountJsonFormsComponent(TwinlistInput, {
      props,
      provide: { asyncChoicesProviderMock },
    });
    expect(wrapper.findComponent(TwinlistLoadingInfo).exists()).toBeTruthy();
    expect(
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual([]);
    expect(
      wrapper.findAllComponents(MultiselectListBox).at(1).find("li").exists(),
    ).toBeFalsy();
    resolveChoices({ result: asyncChoicesResult, state: "SUCCESS" });
    await flushPromises();
    expect(wrapper.findComponent(TwinlistLoadingInfo).exists()).toBeFalsy();
    expect(wrapper.findComponent(Twinlist).props().hideOptions).toBeFalsy();
    expect(
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual(asyncChoicesResult);
    expect(
      wrapper.findAllComponents(MultiselectListBox).at(1).find("li").exists(),
    ).toBeTruthy();
  });

  it("calls handleChange when twinlist input is changed", async () => {
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(handleChange).toHaveBeenCalled();
  });

  describe("handles changes", () => {
    it("handles selected values change", async () => {
      const selected = ["A", "B", "C"];
      await wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("update:selected", selected);
      expect(handleChange).toHaveBeenCalledWith(
        props.control.path,
        expect.objectContaining({ selected }),
      );
    });

    it("handles array manual selection values change", () => {
      const selected = ["A", "B", "C"];
      wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("update:manualSelection", selected);
      expect(handleChange).toHaveBeenCalledWith(
        props.control.path,
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
        .findComponent(MultiModeTwinlist)
        .vm.$emit("update:manualSelection", {
          includedValues: selected,
          excludedValues: deselected,
          includeUnknownValues,
        });
      expect(handleChange).toHaveBeenCalledWith(
        props.control.path,
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
        .findComponent(MultiModeTwinlist)
        .vm.$emit("update:pattern", pattern);
      expect(handleChange).toHaveBeenNthCalledWith(
        1,
        props.control.path,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ pattern }),
        }),
      );
    });

    it("handles isInverted change", () => {
      const isInverted = true;
      wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("update:inversePattern", isInverted);
      expect(handleChange).toHaveBeenNthCalledWith(
        1,
        props.control.path,
        expect.objectContaining({
          patternFilter: expect.objectContaining({ isInverted }),
        }),
      );
    });

    it("handles isCaseSensitive change", () => {
      const isCaseSensitive = true;
      wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("update:caseSensitivePattern", isCaseSensitive);
      expect(handleChange).toHaveBeenNthCalledWith(
        1,
        props.control.path,
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
        .findComponent(MultiModeTwinlist)
        .vm.$emit("update:selected-types", selectedTypes, typeDisplays);
      expect(handleChange).toHaveBeenNthCalledWith(
        1,
        props.control.path,
        expect.objectContaining({
          typeFilter: expect.objectContaining({ selectedTypes, typeDisplays }),
        }),
      );
    });
  });

  it("correctly transforms the data into possible values", () => {
    expect(
      wrapper.findComponent(MultiModeTwinlist).props().possibleValues,
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
      wrapper.findComponent(MultiModeTwinlist).props().additionalPossibleTypes,
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
      const localProps = mergeDeep(props, {
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

      const { wrapper, handleChange } = mountJsonFormsComponent(TwinlistInput, {
        props: localProps,
      });
      await flushPromises();
      const manuallySelected = ["A", "B"];
      expect(handleChange).not.toHaveBeenCalled();
      expect(
        wrapper.findComponent(MultiModeTwinlist).props().manualSelection,
      ).toStrictEqual({
        includedValues: manuallySelected,
        excludedValues: ["C", "D", "E"],
        includeUnknownValues: false,
      });
    });

    it("includes unknown columns without emitting an update", async () => {
      const localProps = mergeDeep(props, {
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
      const { wrapper, handleChange } = mountJsonFormsComponent(TwinlistInput, {
        props: localProps,
      });
      await flushPromises();
      const manuallySelected = ["A", "B", "E"];
      expect(handleChange).not.toHaveBeenCalled();
      expect(
        wrapper.findComponent(MultiModeTwinlist).props().manualSelection,
      ).toStrictEqual(manuallySelected);
    });
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(MultiModeTwinlist).props().pattern).toBe(
      props.control.data.patternFilter.pattern,
    );
    expect(
      wrapper.findComponent(MultiModeTwinlist).props().selectedTypes,
    ).toStrictEqual(props.control.data.typeFilter.selectedTypes);
    expect(
      wrapper.findComponent(MultiModeTwinlist).props().manualSelection,
    ).toStrictEqual(props.control.data.manualFilter.manuallySelected);
    expect(wrapper.findComponent(MultiModeTwinlist).props().mode).toBe(
      "manual",
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("disables twinlist when controlled by a flow variable", () => {
    const oneOfTheSubKeys = "manualFilter.manuallySelected";
    const { wrapper } = mountJsonFormsComponent(TwinlistInput, {
      props,
      withControllingFlowVariable: `${props.control.path}.${oneOfTheSubKeys}`,
    });
    expect(
      wrapper.findComponent(MultiModeTwinlist).props().disabled,
    ).toBeTruthy();
  });

  it("moves missing values correctly", async () => {
    props.control.data.manualFilter = {
      manuallySelected: ["missing"],
      manuallyDeselected: ["test_1", "test_2", "test_3"],
      includeUnknownColumns: false,
    };
    const { wrapper, handleChange } = mountJsonFormsComponent(TwinlistInput, {
      props,
    });
    await flushPromises();
    expect(wrapper.props().control.data.manualFilter).toMatchObject({
      manuallySelected: ["missing"],
    });
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllLeft" })
      .trigger("click");
    expect(handleChange).toBeCalledWith(
      props.control.path,
      expect.objectContaining({
        manualFilter: {
          manuallySelected: [],
          manuallyDeselected: ["test_1", "test_2", "test_3"],
          includeUnknownColumns: false,
        },
      }),
    );
  });

  it("does not render content of TwinlistInput when visible is false", async () => {
    wrapper.vm.control = { ...props.control, visible: false };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DialogLabel).exists()).toBe(false);
  });

  describe("left and right label", () => {
    it("passes the labels given by the uischema options to the twinlist if available", async () => {
      const includedLabel = "includedLabelLeft";
      const excludedLabel = "excludedLabelRight";
      props.control.uischema.options.includedLabel = includedLabel;
      props.control.uischema.options.excludedLabel = excludedLabel;
      const { wrapper } = await mountJsonFormsComponent(TwinlistInput, {
        props,
      });
      expect(wrapper.vm.leftLabel).toBe(excludedLabel);
      expect(wrapper.vm.rightLabel).toBe(includedLabel);
    });

    it("passes the labels given by the props if uischema options are not available", () => {
      expect(wrapper.vm.leftLabel).toBe("Excludes");
      expect(wrapper.vm.rightLabel).toBe("Includes");
    });
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options.choicesProvider = choicesProvider;

    let provideChoices;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsComponent(TwinlistInput, {
      props,
      provide: { addStateProviderListenerMock },
    });
    expect(addStateProviderListenerMock).toHaveBeenCalledWith(
      { id: choicesProvider },
      expect.anything(),
    );
    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
      },
    ];
    provideChoices(providedChoices);
    await flushPromises();
    expect(
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
