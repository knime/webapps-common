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

import { KdsSortableListBox } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import SortListControl, {
  DEFAULT_ANY_UNKNOWN_VALUES_ID,
} from "../SortListControl.vue";

describe("SortListControl", () => {
  let props: VueControlTestProps<typeof SortListControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const possibleValues = [
    {
      id: "test_1",
      text: "Test_1",
    },
    {
      id: "test_2",
      text: "Test_2",
    },
    {
      id: "test_3",
      text: "Test_3",
    },
    {
      id: "unknown",
      text: "Unknown",
    },
  ];

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: ["test_1", "test_3", DEFAULT_ANY_UNKNOWN_VALUES_ID, "test_2"],
        schema: {
          type: "array",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/test",
          options: {
            format: "sortList",
            possibleValues,
          },
        },
      },
      disabled: false,
      isValid: false,
      labelForId: "test-label-id",
    };
    const component = mountJsonFormsControlLabelContent(SortListControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(KdsSortableListBox).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(KdsSortableListBox).props().id).toBe(
      "test-label-id",
    );
  });

  it("calls onChange when sortable list box value is changed", async () => {
    const newSelected = ["test_3", "test_2", "test_1"];
    await wrapper
      .findComponent(KdsSortableListBox)
      .vm.$emit("update:modelValue", newSelected);
    expect(changeValue).toBeCalledWith(newSelected);
  });

  it("sets correct initial values", () => {
    const sortableListBoxProps = wrapper
      .findComponent(KdsSortableListBox)
      .props();
    expect(sortableListBoxProps.modelValue).toStrictEqual(props.control.data);
    expect(sortableListBoxProps.possibleValues).toStrictEqual([
      ...possibleValues,
      {
        id: DEFAULT_ANY_UNKNOWN_VALUES_ID,
        text: "Any unknown column",
        special: true,
      },
    ]);
  });

  it("sets data if none are present", async () => {
    props.control.data = [];
    const { changeValue } = mountJsonFormsControlLabelContent(SortListControl, {
      props,
    });
    await flushPromises();
    expect(changeValue).toHaveBeenCalledWith([
      "test_1",
      "test_2",
      "test_3",
      "unknown",
      DEFAULT_ANY_UNKNOWN_VALUES_ID,
    ]);
  });

  it("sets unknown values", () => {
    expect(changeValue).toHaveBeenCalledWith([
      "test_1",
      "test_3",
      DEFAULT_ANY_UNKNOWN_VALUES_ID,
      "unknown",
      "test_2",
    ]);
  });

  it("uses choicesProvider if present", async () => {
    props.control.uischema.providedOptions = ["possibleValues"];

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper, changeValue } = mountJsonFormsControlLabelContent(
      SortListControl,
      {
        props,
        provide: { addStateProviderListener },
      },
    );
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
    const sortableListBoxProps = wrapper
      .findComponent(KdsSortableListBox)
      .props();
    expect(sortableListBoxProps.possibleValues).toStrictEqual([
      ...providedChoices,
      {
        id: DEFAULT_ANY_UNKNOWN_VALUES_ID,
        text: "Any unknown column",
        special: true,
      },
    ]);
    expect(changeValue).toHaveBeenCalledWith([
      "test_1",
      "test_3",
      DEFAULT_ANY_UNKNOWN_VALUES_ID,
      providedChoices[0].id,
      "test_2",
    ]);
  });

  describe("custom uischema options", () => {
    it("uses custom unknownElementId and unknownElementLabel", async () => {
      const customId = "my-custom-unknown-id";
      props.control.data = ["test_1", customId, "test_2"];
      props.control.uischema.options!.unknownElementId = customId;
      props.control.uischema.options!.unknownElementLabel =
        "Custom unknown label";
      const { wrapper } = mountJsonFormsControlLabelContent(SortListControl, {
        props,
      });
      await flushPromises();
      const sortableListBoxProps = wrapper
        .findComponent(KdsSortableListBox)
        .props();
      expect(sortableListBoxProps.possibleValues).toStrictEqual([
        ...possibleValues,
        {
          id: customId,
          text: "Custom unknown label",
          special: true,
        },
      ]);
    });
  });

  describe("data type accessory rendering", () => {
    beforeEach(async () => {
      props.control.data = [
        "type_1",
        DEFAULT_ANY_UNKNOWN_VALUES_ID,
        "missing_type",
      ];
      props.control.uischema.options!.possibleValues = [
        {
          id: "type_1",
          text: "Type 1",
          type: { id: "type_1", text: "Type 1" },
        },
      ];

      const component = mountJsonFormsControlLabelContent(SortListControl, {
        props,
      });

      await flushPromises();
      wrapper = component.wrapper;
    });

    it("passes data type as accessory", () => {
      const sortableListBoxProps = wrapper
        .findComponent(KdsSortableListBox)
        .props();
      const options = sortableListBoxProps.possibleValues;
      expect(options[0]).toStrictEqual({
        id: "type_1",
        text: "Type 1",
        accessory: { type: "dataType", name: "type_1" },
      });
    });

    it("passes special item without accessory", () => {
      const sortableListBoxProps = wrapper
        .findComponent(KdsSortableListBox)
        .props();
      const options = sortableListBoxProps.possibleValues;
      expect(options[1]).toStrictEqual({
        id: DEFAULT_ANY_UNKNOWN_VALUES_ID,
        text: "Any unknown column",
        special: true,
      });
    });
  });
});
