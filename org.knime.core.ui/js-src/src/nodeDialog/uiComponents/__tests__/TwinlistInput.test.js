/* eslint-disable max-lines */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import TwinlistInput from "../TwinlistInput.vue";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";
import LabeledInput from "../label/LabeledInput.vue";
import DialogLabel from "../label/DialogLabel.vue";
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

  let wrapper, component, updateData;

  beforeEach(() => {
    component = mountJsonFormsComponent(TwinlistInput, { props });
    wrapper = component.wrapper;
    updateData = component.updateData;
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

  it("calls updateDate when twinlist input is changed", async () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper } = mountJsonFormsComponent(TwinlistInput, {
      props,
      provide: { setDirtyModelSettingsMock },
    });
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(updateData).toHaveBeenCalled();
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  describe("handles changes", () => {
    it("handles selected values change", () => {
      const selected = ["A", "B", "C"];
      wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("input", { selected, isManual: false });
      expect(updateData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        props.control.path,
        expect.objectContaining({ selected }),
      );
    });

    it("handles selected values change on manual input", () => {
      const selected = ["A", "B", "C"];
      const deselected = ["E", "F", "G"];
      wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("input", { selected, isManual: true, deselected });
      expect(updateData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        props.control.path,
        expect.objectContaining({
          selected,
          manualFilter: expect.objectContaining({
            manuallySelected: selected,
            manuallyDeselected: deselected,
          }),
        }),
      );
    });

    it("handles includeUnknownColumns change", () => {
      const includeUnknownColumns = false;
      wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("includeUnknownValuesInput", includeUnknownColumns);
      expect(updateData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        props.control.path,
        expect.objectContaining({
          manualFilter: expect.objectContaining({ includeUnknownColumns }),
        }),
      );
    });

    it("handles pattern change", () => {
      const pattern = "abc";
      wrapper
        .findComponent(MultiModeTwinlist)
        .vm.$emit("patternInput", pattern);
      expect(updateData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
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
        .vm.$emit("inversePatternInput", isInverted);
      expect(updateData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
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
        .vm.$emit("caseSensitivePatternInput", isCaseSensitive);
      expect(updateData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
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
        .vm.$emit("typesInput", selectedTypes, typeDisplays);
      expect(updateData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
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
    it("excludes unknown columns", async () => {
      const localProps = mergeDeep(props, {
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

      const { wrapper, updateData } = mountJsonFormsComponent(TwinlistInput, {
        props: localProps,
      });
      await flushPromises();
      const manuallySelected = ["A", "B"];
      expect(updateData).toHaveBeenCalledTimes(1);
      expect(updateData).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        localProps.control.path,
        expect.objectContaining({
          manualFilter: expect.objectContaining({
            manuallySelected,
            manuallyDeselected: ["D", "E"],
          }),
        }),
      );
      expect(
        wrapper.findComponent(MultiModeTwinlist).props()
          .initialManuallySelected,
      ).toStrictEqual(manuallySelected);
    });

    it("includes unknown columns", async () => {
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
      const { wrapper, updateData } = mountJsonFormsComponent(TwinlistInput, {
        props: localProps,
      });
      await flushPromises();
      const manuallySelected = ["A", "B", "E"];
      expect(updateData).toHaveBeenCalledTimes(1);
      expect(updateData).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        localProps.control.path,
        expect.objectContaining({
          manualFilter: expect.objectContaining({
            manuallySelected,
            manuallyDeselected: ["D"],
          }),
        }),
      );
      expect(
        wrapper.findComponent(MultiModeTwinlist).props()
          .initialManuallySelected,
      ).toStrictEqual(manuallySelected);
    });
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(MultiModeTwinlist).vm.initialPattern).toBe(
      props.control.data.patternFilter.pattern,
    );
    expect(
      wrapper.findComponent(MultiModeTwinlist).vm.initialSelectedTypes,
    ).toStrictEqual(props.control.data.typeFilter.selectedTypes);
    expect(
      wrapper.findComponent(MultiModeTwinlist).vm.initialManuallySelected,
    ).toStrictEqual(props.control.data.manualFilter.manuallySelected);
    expect(wrapper.findComponent(MultiModeTwinlist).vm.initialMode).toBe(
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
    const setDirtyModelSettingsMock = vi.fn();
    const localProps = {
      ...props,
      control: {
        ...props.control,
        data: {
          ...props.control.data,
          manualFilter: {
            manuallySelected: ["missing"],
            manuallyDeselected: ["test_1", "test_2", "test_3"],
            includeUnknownColumns: false,
          },
        },
      },
    };
    const { wrapper, updateData } = mountJsonFormsComponent(TwinlistInput, {
      props: localProps,
      provide: { setDirtyModelSettingsMock },
    });
    await flushPromises();
    expect(wrapper.props().control.data.manualFilter).toMatchObject({
      manuallySelected: ["missing"],
    });
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllLeft" })
      .trigger("click");
    expect(updateData).toBeCalledWith(
      expect.anything(),
      props.control.path,
      expect.objectContaining({
        manualFilter: {
          manuallySelected: [],
          manuallyDeselected: ["test_1", "test_2", "test_3"],
          includeUnknownColumns: false,
        },
        selected: [],
      }),
    );
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(updateData).toBeCalledWith(
      expect.anything(),
      props.control.path,
      expect.objectContaining({
        manualFilter: {
          manuallySelected: ["test_1", "test_2", "test_3"],
          manuallyDeselected: [],
          includeUnknownColumns: false,
        },
        selected: ["test_1", "test_2", "test_3"],
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
});
