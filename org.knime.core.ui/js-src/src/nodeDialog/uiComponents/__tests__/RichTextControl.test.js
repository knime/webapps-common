import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import { RichTextEditor } from "@knime/rich-text-editor";
import RichTextControl from "../RichTextControl.vue";
import { inputFormats } from "@/nodeDialog/constants";
import DialogLabel from "../label/DialogLabel.vue";

describe("RichTextControl.vue", () => {
  let props, wrapper, component, stubs;

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("richTextContent"),
        data: "test",
        schema: {
          properties: {
            richTextContent: {
              type: "string",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/richTextContent",
          options: {
            format: inputFormats.richTextInput,
          },
        },
      },
    };
    stubs = {
      EditorContent: true,
    };
    component = mountJsonFormsComponent(RichTextControl, { props, stubs });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(RichTextControl).exists()).toBeTruthy();
    expect(wrapper.findComponent(RichTextEditor).exists()).toBeTruthy();
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(RichTextEditor).attributes().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when html content is changed", async () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, handleChange } = await mountJsonFormsComponent(
      RichTextControl,
      {
        props,
        provide: { setDirtyModelSettingsMock },
        stubs: {
          EditorContent: true,
        },
      },
    );
    const changedRichTextControl = "abcdefg";
    wrapper
      .findComponent(RichTextEditor)
      .vm.$emit("update:modelValue", changedRichTextControl);
    expect(handleChange).toHaveBeenCalledWith(
      props.control.path,
      changedRichTextControl,
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(RichTextEditor).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("sets editor to editable", () => {
    const editorComponent = wrapper.findComponent(RichTextEditor);
    expect(editorComponent.vm.editable).toBeTruthy();
  });

  it("disables editor if content is overwritten by flow variable", async () => {
    let localComponent = await mountJsonFormsComponent(RichTextControl, {
      props,
      withControllingFlowVariable: true,
    });
    let localWrapper = localComponent.wrapper;
    expect(localWrapper.vm.disabled).toBeTruthy();
    const editorComponent = localWrapper.findComponent(RichTextEditor);
    expect(editorComponent.vm.editable).toBeFalsy();
  });
});
