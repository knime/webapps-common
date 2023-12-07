import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import ComboBoxInput from "../ComboBoxInput.vue";
import LabeledInput from "../label/LabeledInput.vue";
import DialogLabel from "../label/DialogLabel.vue";

import ComboBox from "webapps-common/ui/components/forms/ComboBox.vue";
import flushPromises from "flush-promises";

describe("ComboBoxInput.vue", () => {
  let props;

  beforeEach(() => {
    props = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
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
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };
  });

  let wrapper, component, updateData;

  beforeEach(() => {
    component = mountJsonFormsComponent(ComboBoxInput, { props });
    wrapper = component.wrapper;
    updateData = component.updateData;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(ComboBoxInput).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
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
    expect(
      wrapper.findComponent(ComboBox).props().initialSelectedIds,
    ).toStrictEqual(props.control.data);
  });

  it("calls handleChange when ComboBox's value changes", () => {
    const comboBox = wrapper.findComponent(ComboBox);
    comboBox.vm.$emit("update:selectedIds", ["id_1", "id_2"]);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      ["id_1", "id_2"],
    );
  });

  it("indicates model settings change when model setting is changed", async () => {
    const dirtySettingsMock = vi.fn();
    props.control.uischema.scope = "#/properties/model/properties/yAxisColumn";
    const { wrapper } = await mountJsonFormsComponent(ComboBoxInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    expect(dirtySettingsMock).not.toHaveBeenCalled();
    const comboBox = wrapper.findComponent(ComboBox);
    comboBox.vm.$emit("update:selectedIds", ["id_1", "id_2"]);
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
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
    const { wrapper } = mountJsonFormsComponent(ComboBoxInput, {
      props,
    });
    await flushPromises();
    const comboBox = wrapper.findComponent(ComboBox);
    expect(comboBox.props().allowNewValues).toBe(true);
  });

  it("disables comboBox when controlled by a flow variable", async () => {
    const { wrapper } = mountJsonFormsComponent(ComboBoxInput, {
      props,
      withControllingFlowVariable: true,
    });
    await flushPromises();
    expect(wrapper.findComponent(ComboBox).attributes().disabled).toBeTruthy();
  });
});
