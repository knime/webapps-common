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

import { SortList } from "@knime/components";
import { KdsButton, KdsDataType } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import LabeledControl from "../../higherOrderComponents/control/LabeledControl.vue";
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
      messages: { errors: [] },
    };
    const component = mountJsonFormsControl(SortListControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findAllComponents(KdsButton).length).toBe(3);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(SortList).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(SortList).props().id).toBeTruthy();
  });

  it("calls onChange when sortList value is changed", async () => {
    const newSelected = ["test_3", "test_2", "test_1"];
    await wrapper
      .findComponent(SortList)
      .vm.$emit("update:modelValue", newSelected);
    expect(changeValue).toBeCalledWith(newSelected);
  });

  it("sets correct initial values", () => {
    const sortListProps = wrapper.findComponent(SortList).props();
    expect(sortListProps.modelValue).toStrictEqual(props.control.data);
    expect(sortListProps.possibleValues).toStrictEqual([
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
    const { changeValue } = mountJsonFormsControl(SortListControl, {
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
    const { wrapper, changeValue } = mountJsonFormsControl(SortListControl, {
      props,
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
    const sortListProps = wrapper.findComponent(SortList).props();
    expect(sortListProps.possibleValues).toStrictEqual([
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

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  describe("buttons", () => {
    const clickButtonWithText = (text: string) =>
      wrapper
        .findAllComponents(KdsButton)
        .filter((button) => button.text() === text)[0]
        .trigger("click");

    it("sorts from A to Z", async () => {
      await clickButtonWithText("A - Z");
      expect(changeValue).toHaveBeenCalledWith([
        DEFAULT_ANY_UNKNOWN_VALUES_ID,
        "test_1",
        "test_2",
        "test_3",
      ]);
    });

    it("sorts from Z to A", async () => {
      await clickButtonWithText("Z - A");
      expect(changeValue).toHaveBeenCalledWith([
        "test_3",
        "test_2",
        "test_1",
        DEFAULT_ANY_UNKNOWN_VALUES_ID,
      ]);
    });

    it("resets to the given possible values", async () => {
      await clickButtonWithText("Reset all");
      expect(changeValue).toHaveBeenCalledWith([
        "test_1",
        "test_2",
        "test_3",
        "unknown",
        DEFAULT_ANY_UNKNOWN_VALUES_ID,
      ]);
    });
  });

  describe("custom uischema options", () => {
    it("uses custom unknownElementId and unknownElementLabel", async () => {
      const customId = "my-custom-unknown-id";
      props.control.data = ["test_1", customId, "test_2"];
      props.control.uischema.options!.unknownElementId = customId;
      props.control.uischema.options!.unknownElementLabel =
        "Custom unknown label";
      const { wrapper } = mountJsonFormsControl(SortListControl, { props });
      await flushPromises();
      const sortListProps = wrapper.findComponent(SortList).props();
      expect(sortListProps.possibleValues).toStrictEqual([
        ...possibleValues,
        {
          id: customId,
          text: "Custom unknown label",
          special: true,
        },
      ]);
    });

    it("uses custom resetSortButtonLabel", () => {
      props.control.uischema.options!.resetSortButtonLabel = "Reset order";
      const { wrapper } = mountJsonFormsControl(SortListControl, { props });
      const resetButton = wrapper
        .findAllComponents(KdsButton)
        .filter((button) => button.text() === "Reset order");
      expect(resetButton.length).toBe(1);
    });

    it("uses default resetSortButtonLabel when not specified", () => {
      const resetButton = wrapper
        .findAllComponents(KdsButton)
        .filter((button) => button.text() === "Reset all");
      expect(resetButton.length).toBe(1);
    });
  });

  describe("slot rendering if types are available", () => {
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

      const component = mountJsonFormsControl(SortListControl, {
        props,
      });

      await flushPromises();
      wrapper = component.wrapper;
    });

    it("renders an existing item", () => {
      expect(wrapper.find(".data-type-entry").exists()).toBeTruthy();
      const type1ListEntry = wrapper.find("ul").findAll("li")[0];
      expect(type1ListEntry.find(".data-type-entry").exists()).toBeTruthy();
      expect(type1ListEntry.text()).toBe("Type 1");
      const dataTypeComp = type1ListEntry.findComponent(KdsDataType);
      expect(dataTypeComp.exists()).toBeTruthy();
      expect(dataTypeComp.props()).toStrictEqual({
        iconName: "type_1",
        iconTitle: "Type 1",
        size: "small",
      });
    });

    it("renders a special item", () => {
      expect(wrapper.find(".data-type-entry").exists()).toBeTruthy();
      const specialListEntry = wrapper.find("ul").findAll("li")[1];
      expect(specialListEntry.find(".data-type-entry").exists()).toBeTruthy();
      expect(specialListEntry.text()).toBe("Any unknown column");
      expect(specialListEntry.findComponent(KdsDataType).exists()).toBeFalsy();
    });

    it("renders an invalid item", () => {
      expect(wrapper.find(".data-type-entry").exists()).toBeTruthy();
      const missingTypeListEntry = wrapper.find("ul").findAll("li")[2];
      expect(
        missingTypeListEntry.find(".data-type-entry").exists(),
      ).toBeTruthy();
      expect(missingTypeListEntry.text()).toBe("(MISSING) missing_type");
      expect(
        missingTypeListEntry.findComponent(KdsDataType).exists(),
      ).toBeTruthy();
    });
  });
});
