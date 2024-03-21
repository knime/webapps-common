import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import RadioInputBase from "../RadioInputBase.vue";
import LabeledInput from "../label/LabeledInput.vue";
import DialogLabel from "../label/DialogLabel.vue";
import RadioButtons from "webapps-common/ui/components/forms/RadioButtons.vue";
import ValueSwitch from "webapps-common/ui/components/forms/ValueSwitch.vue";
import BaseRadioButtons from "webapps-common/ui/components/forms/BaseRadioButtons.vue";

describe("RadioInputBase.vue", () => {
  let props, wrapper, component;

  const possibleValues = [
    {
      const: "LOG",
      title: "Logarithmic",
    },
    {
      const: "VALUE",
      title: "Linear",
    },
  ];

  beforeEach(async () => {
    props = {
      type: "radio",
      control: {
        ...getControlBase("test"),
        data: "LOG",
        schema: {
          oneOf: possibleValues,
        },
        uischema: {
          type: "Control",
          scope: "#/properties/testScale",
          options: {
            format: "radio",
            radioLayout: "horizontal",
          },
        },
      },
    };

    component = await mountJsonFormsComponent(RadioInputBase, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(RadioInputBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(RadioButtons).exists()).toBe(true);
    expect(wrapper.findComponent(BaseRadioButtons).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(RadioButtons).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  const createTypedWrapper = (type) =>
    mountJsonFormsComponent(RadioInputBase, {
      props: {
        ...props,
        type,
        control: {
          ...props.control,
          uischema: {
            ...props.control.schema,
            scope: "#/properties/model/properties/testColumn",
          },
        },
      },
    });

  const testTypes = [
    ["radio", RadioButtons],
    ["valueSwitch", ValueSwitch],
    ["unknown", RadioButtons],
  ];

  it.each(testTypes)("renders explicit type %s", async (type, comp) => {
    const { wrapper } = await createTypedWrapper(type);
    expect(wrapper.getComponent(RadioInputBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(BaseRadioButtons).exists()).toBe(true);
    expect(wrapper.getComponent(comp).exists()).toBe(true);
  });

  it.each(testTypes)(
    "initializes jsonforms for type %s",
    async (type, _comp) => {
      const component = await createTypedWrapper(type);
      initializesJsonFormsControl(component);
    },
  );

  it.each([
    ["radio", -10],
    ["valueSwitch", 0],
    ["unknown", -10],
  ])("type %s uses %d px as bottom margin", async (type, marginBottom) => {
    const { wrapper } = await createTypedWrapper(type);
    expect(wrapper.vm.marginBottom).toBe(marginBottom);
  });

  it("calls updateData when radio button is changed", async () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = await mountJsonFormsComponent(
      RadioInputBase,
      {
        props,
        provide: { setDirtyModelSettingsMock },
      },
    );
    const changedRadioInputBase = "Shaken not stirred";
    wrapper
      .findComponent(RadioButtons)
      .vm.$emit("update:modelValue", changedRadioInputBase);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      changedRadioInputBase,
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(BaseRadioButtons).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("sets correct possible values", () => {
    expect(
      wrapper.findComponent(BaseRadioButtons).props().possibleValues,
    ).toStrictEqual([
      { id: "LOG", text: "Logarithmic" },
      { id: "VALUE", text: "Linear" },
    ]);
  });

  it("disables individual possible values if desired", async () => {
    props.control.uischema.options.disabledOptions = possibleValues[0].const;
    const { wrapper } = await mountJsonFormsComponent(RadioInputBase, {
      props,
    });
    expect(
      wrapper.findComponent(BaseRadioButtons).props().possibleValues,
    ).toStrictEqual([
      { id: "LOG", text: "Logarithmic", disabled: true },
      { id: "VALUE", text: "Linear" },
    ]);
  });

  it("disables radioInput when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(RadioInputBase, {
      props,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not disable radioInput when not controlled by a flow variable", () => {
    props.control.rootSchema.flowVariablesMap[props.control.path] = {};
    expect(wrapper.vm.disabled).toBeFalsy();
  });
});
