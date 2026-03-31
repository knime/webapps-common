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
} from "../../../../testUtils/component";
import type { IdAndText } from "../../../types/ChoicesUiSchema";
import SimpleTwinlistControl from "../SimpleTwinlistControl.vue";

describe("SimpleTwinlistControl", () => {
  let props: VueControlTestProps<typeof SimpleTwinlistControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      labelForId,
      disabled: false,
      isValid: false,
      control: {
        ...getControlBase("test"),
        data: ["test_1"],
        schema: {
          type: "array",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/test",
          options: {
            possibleValues: [
              {
                id: "test_1",
                text: "test_1",
              },
              {
                id: "test_2",
                text: "test_2",
              },
              {
                id: "test_3",
                text: "test_3",
              },
            ],
          },
        },
      },
    };
  });

  const mountSimpleTwinlistControl = ({
    provide,
  }: {
    provide?: Partial<ProvidedMethods>;
  } = {}) => {
    return mountJsonFormsControlLabelContent(SimpleTwinlistControl, {
      props,
      provide,
    });
  };

  beforeEach(() => {
    const component = mountSimpleTwinlistControl();
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(KdsTwinList).exists()).toBe(true);
  });

  it("renders data type icons via accessory for typed string choices", async () => {
    await wrapper.setProps({
      control: {
        ...props.control,
        uischema: {
          options: {
            possibleValues: [
              {
                id: "test_1",
                text: "test_1",
                type: { id: "string-datatype", text: "String" },
              },
              {
                id: "test_2",
                text: "test_2",
                type: { id: "string-datatype", text: "String" },
              },
            ],
          },
        },
      },
    });
    const possibleValues = wrapper
      .findComponent(KdsTwinList)
      .props().possibleValues;
    expect(possibleValues[0].accessory).toEqual({
      type: "dataType",
      name: "string-datatype",
    });
    expect(possibleValues[1].accessory).toEqual({
      type: "dataType",
      name: "string-datatype",
    });
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(KdsTwinList).attributes().id).toBe(labelForId);
  });

  it("calls changeValue when twinlist input is changed", () => {
    const newIncluded = ["test_1", "test_2", "test_3"];
    wrapper
      .findComponent(KdsTwinList)
      .vm.$emit("update:manuallyIncluded", newIncluded);
    expect(changeValue).toHaveBeenCalledWith(newIncluded);
  });

  it("sets correct initial value", () => {
    expect(
      wrapper.findComponent(KdsTwinList).props().manuallyIncluded,
    ).toStrictEqual(props.control.data);
  });

  it("moves missing values correctly", async () => {
    props.control.data = ["missing"];
    const { wrapper, changeValue } = await mountSimpleTwinlistControl();
    expect((wrapper.vm as any).control.data).toStrictEqual(["missing"]);
    wrapper.findComponent(KdsTwinList).vm.$emit("update:manuallyIncluded", []);
    expect(changeValue).toBeCalledWith([]);
  });

  it("uses choicesProvider if present", async () => {
    props.control.uischema.providedOptions = ["possibleValues"];
    delete props.control.uischema.options!.possibleValues;

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountSimpleTwinlistControl({
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
    await flushPromises();
    expect(wrapper.findComponent(KdsTwinList).props().loading).toBeTruthy();
    provideChoices!(providedChoices);
    await flushPromises();
    expect(
      wrapper.findComponent(KdsTwinList).props().possibleValues,
    ).toStrictEqual(providedChoices);
    expect(wrapper.findComponent(KdsTwinList).props().loading).toBeFalsy();
  });
});
