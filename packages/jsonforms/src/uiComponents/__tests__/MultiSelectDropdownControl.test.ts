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

import { Multiselect } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import MultiSelectDropdownControl from "../MultiSelectDropdownControl.vue";

describe("MultiSelectDropdownControl", () => {
  let props: VueControlTestProps<typeof MultiSelectDropdownControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

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
    const component = mountJsonFormsControlLabelContent(
      MultiSelectDropdownControl,
      {
        props,
      },
    );
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(Multiselect).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(Multiselect).attributes().id).toBe(labelForId);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Multiselect).props().modelValue).toStrictEqual(
      props.control.data,
    );
    expect(wrapper.findComponent(Multiselect).props().possibleValues).toEqual(
      props.control.uischema.options!.possibleValues,
    );
  });

  it("correctly transforms the data into possible values if none are given", () => {
    delete props.control.uischema.options!.possibleValues;
    const { wrapper } = mountJsonFormsControlLabelContent(
      MultiSelectDropdownControl,
      {
        props,
      },
    );
    expect(wrapper.findComponent(Multiselect).props().possibleValues).toEqual([
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

  it("calls changeValue when Multiselect's value changes", () => {
    const multiselect = wrapper.findComponent(Multiselect);
    multiselect.vm.$emit("update:modelValue", ["id_1", "id_2"]);
    expect(changeValue).toHaveBeenCalledWith(["id_1", "id_2"]);
  });

  it("uses choicesProvider if present", async () => {
    props.control.uischema.providedOptions = ["possibleValues"];

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsControlLabelContent(
      MultiSelectDropdownControl,
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
    expect(
      wrapper.findComponent(Multiselect).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
