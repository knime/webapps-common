import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { MultiselectListBox, Twinlist } from "@knime/components";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import DialogLabel from "../../label/DialogLabel.vue";
import LabeledControl from "../../label/LabeledControl.vue";
import TwinlistLoadingInfo from "../../loading/TwinlistLoadingInfo.vue";
import SimpleTwinlistControl from "../SimpleTwinlistControl.vue";

describe("SimpleTwinlistControl.vue", () => {
  let props, wrapper, component;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: ["test_1"],
        schema: {
          type: "array",
        },
        uischema: {
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
    component = mountJsonFormsComponent(SimpleTwinlistControl, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(SimpleTwinlistControl).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(Twinlist).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(Twinlist).attributes().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when twinlist input is changed", async () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = await mountJsonFormsComponent(
      SimpleTwinlistControl,
      {
        props,
        provide: { setDirtyModelSettingsMock },
      },
    );
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(updateData).toBeCalled();
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("correctly transforms the data into possible values", () => {
    expect(wrapper.findComponent(Twinlist).props().possibleValues).toEqual([
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
    ]);
  });

  it("renders TwinlistLoadingInfo when the possible values are being loaded", async () => {
    delete props.control.uischema.options.possibleValues;
    props.control.uischema.options.choicesProviderClass =
      "dummyChoicesProvider";
    const asyncChoicesResult = [{ id: "id", text: "text" }];
    let resolveChoices;
    const asyncChoicesProviderMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveChoices = resolve;
      }),
    );
    const { wrapper } = mountJsonFormsComponent(SimpleTwinlistControl, {
      props,
      provide: { asyncChoicesProviderMock },
    });
    expect(wrapper.findComponent(TwinlistLoadingInfo).exists()).toBeTruthy();
    expect(
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual([]);
    expect(
      wrapper.findAllComponents(MultiselectListBox).at(1).find("li").exists(),
    ).toBeFalsy();
    resolveChoices({ result: asyncChoicesResult, state: "SUCCESS" });
    await flushPromises();
    expect(wrapper.findComponent(TwinlistLoadingInfo).exists()).toBeFalsy();
    expect(wrapper.findComponent(Twinlist).props().hideOptions).toBeFalsy();
    expect(
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual(asyncChoicesResult);
    expect(
      wrapper.findAllComponents(MultiselectListBox).at(1).find("li").exists(),
    ).toBeTruthy();
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Twinlist).props().modelValue).toStrictEqual(
      props.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("disables twinlist when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(SimpleTwinlistControl, {
      props,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("moves missing values correctly", async () => {
    const setDirtyModelSettingsMock = vi.fn();
    props.control.data = ["missing"];
    const { wrapper, handleChange } = await mountJsonFormsComponent(
      SimpleTwinlistControl,
      {
        props,
        provide: { setDirtyModelSettingsMock },
      },
    );
    expect(wrapper.props().control.data).toStrictEqual(["missing"]);
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllLeft" })
      .trigger("click");
    await wrapper.vm.$nextTick();
    expect(handleChange).toBeCalledWith(props.control.path, []);
  });

  it("does not render content of SimpleTwinlistControl when visible is false", async () => {
    wrapper.vm.control = { ...props.control, visible: false };
    await flushPromises(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DialogLabel).exists()).toBe(false);
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options.choicesProvider = choicesProvider;

    let provideChoices;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsComponent(SimpleTwinlistControl, {
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
      wrapper.findComponent(Twinlist).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
