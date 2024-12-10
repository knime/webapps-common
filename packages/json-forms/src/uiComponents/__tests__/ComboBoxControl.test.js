import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { ComboBox } from "@knime/components";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import ComboBoxControl from "../ComboBoxControl.vue";
import DialogLabel from "../label/DialogLabel.vue";
import LabeledControl from "../label/LabeledControl.vue";

describe("ComboBoxControl.vue", () => {
  let props;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: ["id_1", "id_3"],
        schema: {
          type: "array",
        },
        uischema: {
          options: {
            possibleValues: [
              {
                id: "id_1",
                text: "text_1",
              },
              {
                id: "id_2",
                text: "text_2",
              },
              {
                id: "id_3",
                text: "text_3",
              },
            ],
          },
        },
      },
    };
  });

  let wrapper, component, handleChange;

  beforeEach(() => {
    component = mountJsonFormsComponent(ComboBoxControl, { props });
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ComboBoxControl).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(ComboBox).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(ComboBox).attributes().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("correctly transforms the data into possible values", () => {
    expect(wrapper.findComponent(ComboBox).props().possibleValues).toEqual(
      props.control.uischema.options.possibleValues,
    );
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(ComboBox).props().modelValue).toStrictEqual(
      props.control.data,
    );
  });

  it("calls handleChange when ComboBox's value changes", () => {
    const comboBox = wrapper.findComponent(ComboBox);
    comboBox.vm.$emit("update:modelValue", ["id_1", "id_2"]);
    expect(handleChange).toHaveBeenCalledWith(props.control.path, [
      "id_1",
      "id_2",
    ]);
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("sets allowNewValues to false when there are possible values defined", () => {
    const comboBox = wrapper.findComponent(ComboBox);
    expect(comboBox.props().allowNewValues).toBe(false);
  });

  it("sets allowNewValues to true when there are no possible values defined", async () => {
    props.control.uischema.options.possibleValues = undefined;
    const { wrapper } = mountJsonFormsComponent(ComboBoxControl, {
      props,
    });
    await flushPromises();
    const comboBox = wrapper.findComponent(ComboBox);
    expect(comboBox.props().allowNewValues).toBe(true);
  });

  it("disables comboBox when controlled by a flow variable", async () => {
    const { wrapper } = mountJsonFormsComponent(ComboBoxControl, {
      props,
      withControllingFlowVariable: true,
    });
    await flushPromises();
    expect(wrapper.findComponent(ComboBox).attributes().disabled).toBeTruthy();
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options.choicesProvider = choicesProvider;

    let provideChoices;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsComponent(ComboBoxControl, {
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
      wrapper.findComponent(ComboBox).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
