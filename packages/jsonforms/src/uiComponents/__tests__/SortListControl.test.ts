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

import { Button, SortList } from "@knime/components";

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

describe("SortListControl.vue", () => {
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
    expect(wrapper.findAllComponents(Button).length).toBe(3);
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
        .findAllComponents(Button)
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
});
