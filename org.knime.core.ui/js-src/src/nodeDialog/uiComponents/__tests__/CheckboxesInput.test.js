import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import CheckboxesInput from "../CheckboxesInput.vue";
import ErrorMessage from "../ErrorMessage.vue";
import DescriptionPopover from "../description/DescriptionPopover.vue";
import ReexecutionIcon from "webapps-common/ui/assets/img/icons/reexecution.svg";
import Checkboxes from "webapps-common/ui/components/forms/Checkboxes.vue";

describe("CheckboxesInput.vue", () => {
  let wrapper, defaultProps, component, dirtySettingsMock, updateData;

  beforeEach(async () => {
    defaultProps = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
        data: ["ADDED"],
        schema: {
          title: "Action",
          anyOf: [
            {
              const: "ADDED",
              title: "Added",
            },
            {
              const: "UPDATED",
              title: "Modified",
            },
            {
              const: "REMOVED",
              title: "Deleted",
            },
          ],
        },
        uischema: {
          type: "Control",
          scope: "#/properties/model/considerFile",
          options: {
            format: "checkboxes",
            checkboxLayout: "vertical",
          },
        },
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };
    dirtySettingsMock = vi.fn();
    component = await mountJsonFormsComponent(CheckboxesInput, {
      props: defaultProps,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    wrapper = component.wrapper;
    updateData = component.updateData;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(CheckboxesInput).exists()).toBe(true);
    expect(wrapper.getComponent(Checkboxes).exists()).toBe(true);
    expect(wrapper.getComponent(ErrorMessage).exists()).toBe(true);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("renders the description popover", async () => {
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
    wrapper.vm.control = { ...defaultProps.control, description: "foo" };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls updateData when checkbox is changed", async () => {
    await wrapper
      .findComponent(Checkboxes)
      .vm.$emit("update:modelValue", ["ADDED", "MODIFIED"]);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      ["ADDED", "MODIFIED"],
    );
    expect(dirtySettingsMock).toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", async () => {
    await wrapper
      .findComponent(Checkboxes)
      .vm.$emit("update:modelValue", ["ADDED"]);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      ["ADDED"],
    );

    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("checks that re-execution icon is present if it is a model setting", () => {
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Checkboxes).vm.modelValue).toStrictEqual(
      defaultProps.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(CheckboxesInput, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
