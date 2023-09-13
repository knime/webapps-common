import {
  afterEach,
  beforeEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import SimpleTwinlistInput from "../SimpleTwinlistInput.vue";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";
import LabeledInput from "../LabeledInput.vue";
import Twinlist from "webapps-common/ui/components/forms/Twinlist.vue";
import MultiselectListBox from "webapps-common/ui/components/forms/MultiselectListBox.vue";
import flushPromises from "flush-promises";

describe("SimpleTwinlistInput.vue", () => {
  let props, wrapper, onChangeSpy, component;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(SimpleTwinlistInput.methods, "onChange");
    SimpleTwinlistInput.methods.handleChange = vi.fn();
  });

  beforeEach(() => {
    props = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
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
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };
    component = mountJsonFormsComponent(SimpleTwinlistInput, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(SimpleTwinlistInput).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(Twinlist).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const labeldInput = wrapper.findComponent(LabeledInput);
    expect(wrapper.getComponent(Twinlist).attributes().id).toBe(
      labeldInput.vm.labelForId,
    );
    expect(labeldInput.vm.labeledElement).toBeDefined();
    expect(labeldInput.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when twinlist input is changed", async () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper } = await mountJsonFormsComponent(SimpleTwinlistInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(onChangeSpy).toBeCalled();
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", async () => {
    const dirtySettingsMock = vi.fn();
    props.control.uischema.scope = "#/properties/model/properties/yAxisColumn";
    const { wrapper } = await mountJsonFormsComponent(SimpleTwinlistInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(onChangeSpy).toBeCalled();
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
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
    const { wrapper } = mountJsonFormsComponent(SimpleTwinlistInput, {
      props,
      provide: { asyncChoicesProviderMock },
    });
    expect(wrapper.findComponent(TwinlistLoadingInfo).exists()).toBeTruthy();
    expect(wrapper.findComponent(Twinlist).props().hideOptions).toBeTruthy();
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
    expect(wrapper.findComponent(Twinlist).vm.chosenValues).toStrictEqual(
      props.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("disables twinlist when controlled by a flow variable", () => {
    props.control.rootSchema.flowVariablesMap[props.control.path] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: "test",
      leaf: true,
    };
    const { wrapper } = mountJsonFormsComponent(SimpleTwinlistInput, {
      props,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("moves missing values correctly", async () => {
    const dirtySettingsMock = vi.fn();
    props.control.data = ["missing"];
    const { wrapper } = await mountJsonFormsComponent(SimpleTwinlistInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    expect(wrapper.props().control.data).toStrictEqual(["missing"]);
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllLeft" })
      .trigger("click");
    await wrapper.vm.$nextTick();
    expect(onChangeSpy).toBeCalledWith([]);
    await wrapper
      .findComponent(Twinlist)
      .find({ ref: "moveAllRight" })
      .trigger("click");
    expect(onChangeSpy).toBeCalledWith(["test_1", "test_2", "test_3"]);
  });

  it("does not render content of SimpleTwinlistInput when visible is false", async () => {
    wrapper.vm.control = { ...props.control, visible: false };
    await flushPromises(); // wait until pending promises are resolved
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
  });
});
