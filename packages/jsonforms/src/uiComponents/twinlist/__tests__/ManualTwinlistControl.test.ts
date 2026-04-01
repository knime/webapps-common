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
} from "../../../../testUtils";
import { mergeDeep } from "../../../utils";
import ManualTwinlistControl from "../ManualTwinlistControl.vue";

describe("ManualTwinlistControl", () => {
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
    expect(wrapper.findComponent(KdsTwinList).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(KdsTwinList).attributes().id).toBe(labelForId);
  });

  it("calls changeValue when twinlist input is changed", async () => {
    const newIncluded = ["test_1", "test_2", "test_3"];
    wrapper
      .findComponent(KdsTwinList)
      .vm.$emit("update:manuallyIncluded", newIncluded);
    // Flush microtask batch
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
          manuallySelected: selected,
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
          manuallyDeselected: deselected,
        }),
      );
    });

    it("handles include unknown values change", async () => {
      wrapper
        .findComponent(KdsTwinList)
        .vm.$emit("update:includeUnknownValues", false);
      await flushPromises();
      expect(changeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          includeUnknownColumns: false,
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
      expect(
        wrapper.findComponent(KdsTwinList).props().manuallyIncluded,
      ).toStrictEqual(expect.arrayContaining(manuallySelected));
    });

    it("batches includeUnknownColumns with manual selection changes", async () => {
      props = mergeDeep(props, {
        control: {
          data: {
            includeUnknownColumns: true,
            manuallySelected: ["A", "B"],
            manuallyDeselected: ["C"],
          },
          uischema: {
            options: {
              possibleValues: [
                { id: "A", text: "A" },
                { id: "B", text: "B" },
                { id: "C", text: "C" },
              ],
            },
          },
        },
      });
      const { wrapper, changeValue } = mountManualTwinlistControl();
      await flushPromises();
      expect(changeValue).not.toHaveBeenCalled();

      // Simulate KdsTwinList emitting all three events synchronously
      // (as happens when the user moves the unknown columns item)
      const twinList = wrapper.findComponent(KdsTwinList);
      twinList.vm.$emit("update:manuallyIncluded", ["A"]);
      twinList.vm.$emit("update:manuallyExcluded", ["B", "C"]);
      twinList.vm.$emit("update:includeUnknownValues", false);
      await flushPromises();

      // All changes should arrive as a single batched call
      expect(changeValue).toHaveBeenCalledTimes(1);
      expect(changeValue).toHaveBeenCalledWith({
        manuallySelected: ["A"],
        manuallyDeselected: ["B", "C"],
        includeUnknownColumns: false,
      });
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
    expect((wrapper.vm as any).control.data).toMatchObject({
      manuallySelected: ["missing"],
    });
    wrapper.findComponent(KdsTwinList).vm.$emit("update:manuallyIncluded", []);
    wrapper
      .findComponent(KdsTwinList)
      .vm.$emit("update:manuallyExcluded", ["test_1", "test_2", "test_3"]);
    await flushPromises();
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
      expect(wrapper.findComponent(KdsTwinList).props("excludeLabel")).toBe(
        excludedLabel,
      );
      expect(wrapper.findComponent(KdsTwinList).props("includeLabel")).toBe(
        includedLabel,
      );
    });

    it("passes the labels given by the props if uischema options are not available", () => {
      expect(wrapper.findComponent(KdsTwinList).props("excludeLabel")).toBe(
        "Excludes",
      );
      expect(wrapper.findComponent(KdsTwinList).props("includeLabel")).toBe(
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
      wrapper.findComponent(KdsTwinList).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
