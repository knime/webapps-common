import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import LabeledLocalFileChooserControl from "../LabeledLocalFileChooserControl.vue";
import LabeledControl from "@/nodeDialog/uiComponents/label/LabeledControl.vue";
import DialogLabel from "@/nodeDialog/uiComponents/label/DialogLabel.vue";
import StringFileChooserControlWithExplorer from "../StringFileChooserControlWithExplorer.vue";

describe("LabeledLocalFileChooserControl.vue", () => {
  let props, wrapper, component;

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: "test",
        schema: {
          properties: {
            localFile: {
              type: "string",
              title: "Local File",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/localFile",
          options: {
            format: "localFileChooser",
            isWriter: false,
          },
        },
      },
    };

    component = await mountJsonFormsComponent(LabeledLocalFileChooserControl, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(LabeledLocalFileChooserControl).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(
      wrapper.findComponent(StringFileChooserControlWithExplorer).exists(),
    ).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(
      wrapper.getComponent(StringFileChooserControlWithExplorer).props().id,
    ).toBe(dialogLabel.vm.labelForId);
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when text input is changed", () => {
    const setDirtyModeSettingsMock = vi.fn();
    const { wrapper, handleChange } = mountJsonFormsComponent(
      LabeledLocalFileChooserControl,
      {
        props,
        provide: { setDirtyModeSettingsMock },
      },
    );
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(StringFileChooserControlWithExplorer)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(handleChange).toHaveBeenCalledWith(
      props.control.path,
      changedTextInput,
    );
    expect(setDirtyModeSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct initial value", () => {
    expect(
      wrapper.findComponent(StringFileChooserControlWithExplorer).vm.modelValue,
    ).toBe(props.control.data);
  });

  it("sets correct browsing options", async () => {
    props.control.uischema.options.fileExtension = "pdf";
    props.control.uischema.options.isWriter = true;

    const { wrapper } = await mountJsonFormsComponent(
      LabeledLocalFileChooserControl,
      {
        props,
      },
    );
    expect(
      wrapper.findComponent(StringFileChooserControlWithExplorer).props()
        .options,
    ).toMatchObject({
      fileExtension: "pdf",
      isWriter: true,
    });
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(
      LabeledLocalFileChooserControl,
      {
        props,
        withControllingFlowVariable: true,
      },
    );
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
