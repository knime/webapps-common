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

import { Twinlist } from "@knime/components";

import {
  type ProvidedMethods,
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import type { IdAndText } from "../../../types/ChoicesUiSchema";
import TwinlistLoadingInfo from "../../loading/TwinlistLoadingInfo.vue";
import SimpleTwinlistControl from "../SimpleTwinlistControl.vue";

describe("SimpleTwinlistControl.vue", () => {
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
    expect(wrapper.findComponent(Twinlist).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(Twinlist).attributes().id).toBe(labelForId);
  });

  it("calls changeValue when twinlist input is changed", async () => {
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(changeValue).toHaveBeenCalled();
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Twinlist).props().modelValue).toStrictEqual(
      props.control.data,
    );
  });

  it("moves missing values correctly", async () => {
    props.control.data = ["missing"];
    const { wrapper, changeValue } = await mountSimpleTwinlistControl();
    expect(wrapper.vm.control.data).toStrictEqual(["missing"]);
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllLeft" })
      .trigger("click");
    await wrapper.vm.$nextTick();
    expect(changeValue).toBeCalledWith([]);
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options!.choicesProvider = choicesProvider;
    delete props.control.uischema.options!.possibleValues;

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountSimpleTwinlistControl({
      provide: { addStateProviderListener },
    });
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
    await flushPromises();
    expect(wrapper.findComponent(TwinlistLoadingInfo).exists()).toBeTruthy();
    provideChoices!(providedChoices);
    await flushPromises();
    expect(
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual(providedChoices);
    expect(wrapper.findComponent(TwinlistLoadingInfo).exists()).toBeFalsy();
  });
});
