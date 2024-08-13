import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import LabeledInput from "../label/LabeledInput.vue";
import DialogLabel from "../label/DialogLabel.vue";
import flushPromises from "flush-promises";
import SortListInput, {
  DEFAULT_ANY_UNKNOWN_VALUES_ID,
} from "../SortListInput.vue";
import { SortList, Button } from "@knime/components";

describe("SortListInput.vue", () => {
  let props, wrapper, component;

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
          options: {
            format: "sortList",
            possibleValues,
          },
        },
      },
    };
    component = mountJsonFormsComponent(SortListInput, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findAllComponents(Button).length).toBe(3);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(SortList).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(SortList).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when sortList value is changed", async () => {
    const newSelected = ["test_3", "test_2", "test_1"];
    await wrapper
      .findComponent(SortList)
      .vm.$emit("update:modelValue", newSelected);
    expect(component.handleChange).toBeCalledWith(
      props.control.path,
      newSelected,
    );
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
    const { handleChange } = mountJsonFormsComponent(SortListInput, { props });
    await flushPromises();
    expect(handleChange).toHaveBeenCalledWith(props.control.path, [
      "test_1",
      "test_2",
      "test_3",
      "unknown",
      DEFAULT_ANY_UNKNOWN_VALUES_ID,
    ]);
  });

  it("sets unknown values", () => {
    expect(component.handleChange).toHaveBeenCalledWith(props.control.path, [
      "test_1",
      "test_3",
      DEFAULT_ANY_UNKNOWN_VALUES_ID,
      "unknown",
      "test_2",
    ]);
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options.choicesProvider = choicesProvider;

    let provideChoices;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper, handleChange } = mountJsonFormsComponent(SortListInput, {
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
    const sortListProps = wrapper.findComponent(SortList).props();
    expect(sortListProps.possibleValues).toStrictEqual([
      ...providedChoices,
      {
        id: DEFAULT_ANY_UNKNOWN_VALUES_ID,
        text: "Any unknown column",
        special: true,
      },
    ]);
    expect(handleChange).toHaveBeenCalledWith(props.control.path, [
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

  it("disables sortList when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(SortListInput, {
      props,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not render content of SortList when visible is false", async () => {
    wrapper.vm.control = { ...props.control, visible: false };
    await flushPromises(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DialogLabel).exists()).toBe(false);
  });

  describe("buttons", () => {
    const clickButtonWithText = (text) =>
      wrapper
        .findAllComponents(Button)
        .filter((button) => button.text() === text)[0]
        .trigger("click");

    it("sorts from A to Z", async () => {
      await clickButtonWithText("A - Z");
      expect(component.handleChange).toHaveBeenCalledWith(props.control.path, [
        DEFAULT_ANY_UNKNOWN_VALUES_ID,
        "test_1",
        "test_2",
        "test_3",
      ]);
    });

    it("sorts from Z to A", async () => {
      await clickButtonWithText("Z - A");
      expect(component.handleChange).toHaveBeenCalledWith(props.control.path, [
        "test_3",
        "test_2",
        "test_1",
        DEFAULT_ANY_UNKNOWN_VALUES_ID,
      ]);
    });

    it("resets to the given possible values", async () => {
      await clickButtonWithText("Reset all");
      expect(component.handleChange).toHaveBeenCalledWith(props.control.path, [
        "test_1",
        "test_2",
        "test_3",
        "unknown",
        DEFAULT_ANY_UNKNOWN_VALUES_ID,
      ]);
    });
  });
});
