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

import { ComboBox } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import ComboBoxControl from "../ComboBoxControl.vue";

describe("ComboBoxControl", () => {
  let props: VueControlTestProps<typeof ComboBoxControl>,
    mountComboboxControl: () => {
      wrapper: VueWrapper;
      changeValue: Mock;
    };

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: ["id_1", "id_3"],
        schema: {
          type: "array",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/test",
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
      labelForId,
      disabled: false,
      isValid: false,
    };

    mountComboboxControl = () => {
      const component = mountJsonFormsControlLabelContent(ComboBoxControl, {
        props,
      });
      return { wrapper: component.wrapper, changeValue: component.changeValue };
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    const { wrapper } = mountComboboxControl();
    expect(wrapper.findComponent(ComboBox).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const { wrapper } = mountComboboxControl();
    expect(wrapper.getComponent(ComboBox).attributes().id).toBe(labelForId);
  });

  it("sets correct initial value", () => {
    const { wrapper } = mountComboboxControl();
    expect(wrapper.findComponent(ComboBox).props().modelValue).toStrictEqual(
      props.control.data,
    );
    expect(wrapper.findComponent(ComboBox).props().possibleValues).toEqual(
      props.control.uischema.options!.possibleValues,
    );
  });

  it("correctly transforms the data into possible values if none are given", () => {
    delete props.control.uischema.options!.possibleValues;
    const { wrapper } = mountJsonFormsControlLabelContent(ComboBoxControl, {
      props,
    });
    expect(wrapper.findComponent(ComboBox).props().possibleValues).toEqual([
      {
        id: "id_1",
        text: "id_1",
      },
      {
        id: "id_3",
        text: "id_3",
      },
    ]);
  });

  it("calls changeValue when ComboBox's value changes", () => {
    const { wrapper, changeValue } = mountComboboxControl();
    const comboBox = wrapper.findComponent(ComboBox);
    comboBox.vm.$emit("update:modelValue", ["id_1", "id_2"]);
    expect(changeValue).toHaveBeenCalledWith(["id_1", "id_2"]);
  });

  it("sets allowNewValues to false when there are possible values defined", () => {
    const { wrapper } = mountComboboxControl();
    const comboBox = wrapper.findComponent(ComboBox);
    expect(comboBox.props().allowNewValues).toBe(false);
  });

  it("sets allowNewValues to true when there are no possible values defined", async () => {
    props.control.uischema.options!.possibleValues = undefined;
    const { wrapper } = mountJsonFormsControlLabelContent(ComboBoxControl, {
      props,
    });
    await flushPromises();
    const comboBox = wrapper.findComponent(ComboBox);
    expect(comboBox.props().allowNewValues).toBe(true);
  });

  it("uses choicesProvider if present", async () => {
    props.control.uischema.providedOptions = ["possibleValues"];

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsControlLabelContent(ComboBoxControl, {
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
    expect(
      wrapper.findComponent(ComboBox).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });

  it("has reactive possible values", async () => {
    props.control.data = [];
    delete props.control.uischema.options!.possibleValues;
    props.control.uischema.providedOptions = ["possibleValues"];
    let provideChoices: (choices: IdAndText[] | null) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsControlLabelContent(ComboBoxControl, {
      props,
      provide: { addStateProviderListener },
    });
    await flushPromises();
    expect(
      wrapper.findComponent(ComboBox).props().possibleValues,
    ).toStrictEqual([]);

    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
      },
    ];
    provideChoices!(providedChoices);
    await flushPromises();
    expect(
      wrapper.findComponent(ComboBox).vm.$data.allPossibleItems,
    ).toStrictEqual(providedChoices);
  });
});
