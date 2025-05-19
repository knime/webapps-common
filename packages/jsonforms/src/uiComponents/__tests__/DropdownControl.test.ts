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
import { flushPromises } from "@vue/test-utils";

import { Dropdown } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import DropdownControl from "../DropdownControl.vue";

describe("DropdownControl.vue", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof DropdownControl>,
    changeValue: Mock;

  const path = "test";
  const labelForId = "labelForId";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase(path),
        data: "Universe_0_0",
        schema: {
          title: "Y Axis Column",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/yAxisColumn",
          options: {
            format: "dropDown",
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
    const component = await mountJsonFormsControlLabelContent(DropdownControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(Dropdown).props().id).toBe(labelForId);
  });

  it("calls handleChange when input is changed", () => {
    const changedDropdownControl = "Shaken not stirred";
    wrapper
      .findComponent(Dropdown)
      .vm.$emit("update:modelValue", changedDropdownControl);
    expect(changeValue).toHaveBeenCalledWith(changedDropdownControl);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("sets placeholder text correctly if possible values are not yet available", async () => {
    delete props.control.uischema.options!.possibleValues;
    const { wrapper } = mountJsonFormsControlLabelContent(DropdownControl, {
      props,
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe("Loading");
  });

  it("sets placeholder text correctly if possible values are empty", async () => {
    props.control.uischema.options!.possibleValues = [];
    const { wrapper } = mountJsonFormsControlLabelContent(DropdownControl, {
      props,
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe(
      "No values present",
    );
  });

  it("sets placeholder text correctly if there are possible values present", async () => {
    props.control.data = "";
    const { wrapper } = mountJsonFormsControlLabelContent(DropdownControl, {
      props,
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe(
      "No value selected",
    );
  });

  it("disables dropdown by prop", async () => {
    await wrapper.setProps({ disabled: true });
    expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
  });

  it("disables dropdown when there are no possible values", async () => {
    props.control.uischema.options!.possibleValues = [];
    const { wrapper } = await mountJsonFormsControlLabelContent(
      DropdownControl,
      {
        props,
      },
    );
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
  });

  it("uses choicesProvider if present", async () => {
    props.control.uischema.providedOptions = ["possibleValues"];

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsControlLabelContent(DropdownControl, {
      props,
      provide: { addStateProviderListener },
    });
    expect(addStateProviderListener).toHaveBeenCalledWith(
      {
        providedOptionName: "possibleValues",
        scope: "#/properties/view/properties/yAxisColumn",
      },
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
      wrapper.findComponent(Dropdown).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
