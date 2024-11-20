import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FunctionButton, InputField } from "@knime/components";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import DialogLabel from "@/nodeDialog/uiComponents/label/DialogLabel.vue";
import LabeledControl from "@/nodeDialog/uiComponents/label/LabeledControl.vue";
import FileBrowserButton from "../../FileBrowserButton.vue";
import FileExplorerTab from "../../withTabs/FileExplorerTab.vue";
import LabeledLocalFileChooserControl from "../LocalFileChooserControl.vue";

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
      stubs: { FileExplorerTab: true },
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
    expect(wrapper.findComponent(InputField).exists()).toBe(true);
    expect(wrapper.findComponent(FileBrowserButton).exists()).toBe(true);
    expect(wrapper.findComponent(FileExplorerTab).exists()).toBe(false);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(InputField).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
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
        stubs: { FileExplorerTab: true },
      },
    );
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(InputField)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(handleChange).toHaveBeenCalledWith(
      props.control.path,
      changedTextInput,
    );
    expect(setDirtyModeSettingsMock).not.toHaveBeenCalled();
  });

  const clickFileBrowserButton = (wrapper) =>
    wrapper
      .findComponent(FileBrowserButton)
      .findComponent(FunctionButton)
      .vm.$emit("click");

  it("sets correct initial value", async () => {
    await clickFileBrowserButton(wrapper);
    expect(wrapper.findComponent(FileExplorerTab).vm.initialFilePath).toBe(
      props.control.data,
    );
  });

  it("sets correct browsing options", async () => {
    props.control.uischema.options.fileExtension = "pdf";
    props.control.uischema.options.isWriter = true;

    const { wrapper } = await mountJsonFormsComponent(
      LabeledLocalFileChooserControl,
      {
        props,
        stubs: { FileExplorerTab: true },
      },
    );
    await clickFileBrowserButton(wrapper);
    expect(wrapper.findComponent(FileExplorerTab).props()).toMatchObject({
      filteredExtensions: ["pdf"],
      appendedExtension: "pdf",
      isWriter: true,
    });
  });

  it("disables input and button when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(
      LabeledLocalFileChooserControl,
      {
        props,
        withControllingFlowVariable: true,
      },
    );
    expect(wrapper.findComponent(InputField).props().disabled).toBe(true);
    expect(wrapper.findComponent(FileBrowserButton).props().disabled).toBe(
      true,
    );
  });
});
