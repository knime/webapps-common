import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";

import { MultiselectListBox } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import MultiSelectListBoxControl from "../MultiSelectListBoxControl.vue";

describe("MultiSelectListBoxControl.vue", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof MultiSelectListBoxControl>,
    changeValue: Mock;

  const path = "test";
  const labelForId = "labelForId";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase(path),
        data: ["Universe_0_0"],
        schema: {
          title: "Y Axis Column",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/yAxisColumn",
          options: {
            format: "multiSelectListBox",
            possibleValues: [
              {
                id: "Universe_0_0",
                text: "Universe_0_0",
              },
              {
                id: "Universe_0_1",
                text: "Universe_0_1",
              },
              {
                id: "Universe_1_0",
                text: "Universe_1_0",
              },
              {
                id: "Universe_1_1",
                text: "Universe_1_1",
              },
            ],
          },
        },
      },
      disabled: false,
      isValid: false,
      labelForId,
    };
    const component = await mountJsonFormsControlLabelContent(
      MultiSelectListBoxControl,
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
    expect(wrapper.findComponent(MultiselectListBox).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(MultiselectListBox).props().id).toBeDefined();
  });

  it("calls handleChange when input is changed", () => {
    const changedValue = ["Shaken not stirred"];
    wrapper
      .findComponent(MultiselectListBox)
      .vm.$emit("update:modelValue", changedValue);
    expect(changeValue).toHaveBeenCalledWith(changedValue);
  });

  it("sets correct initial value", () => {
    expect(
      wrapper.findComponent(MultiselectListBox).props("modelValue"),
    ).toStrictEqual(props.control.data);
  });

  it("disables listBox by prop", async () => {
    await wrapper.setProps({ disabled: true });
    expect(
      wrapper.findComponent(MultiselectListBox).props("disabled"),
    ).toBeTruthy();
  });

  it("sets size via options", () => {
    const size = 5;
    props.control.uischema.options!.size = size;
    const { wrapper } = mountJsonFormsControlLabelContent(
      MultiSelectListBoxControl,
      {
        props,
      },
    );

    expect(wrapper.findComponent(MultiselectListBox).props("size")).toBe(size);
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options!.choicesProvider = choicesProvider;

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsControlLabelContent(
      MultiSelectListBoxControl,
      {
        props,
        provide: { addStateProviderListener },
      },
    );
    expect(addStateProviderListener).toHaveBeenCalledWith(
      { id: choicesProvider },
      expect.anything(),
    );
    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
      },
    ];
    provideChoices!(providedChoices);
    await nextTick();
    expect(
      wrapper.findComponent(MultiselectListBox).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
