import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import RichTextEditor from "webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue";
import RichTextInput from "../RichTextInput.vue";
import { inputFormats } from "@/nodeDialog/constants";
import DialogLabel from "../label/DialogLabel.vue";

describe("RichTextInput.vue", () => {
  let props, wrapper, component, stubs;

  beforeEach(() => {
    props = {
      control: {
        path: "richTextContent",
        visible: true,
        enabled: true,
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
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {
            flowVar1: "flow value",
          },
        },
      },
    };
    stubs = {
      EditorContent: true,
    };
    component = mountJsonFormsComponent(RichTextInput, { props, stubs });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(RichTextInput).exists()).toBeTruthy();
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

  it("calls updateData when html content is changed", async () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = await mountJsonFormsComponent(
      RichTextInput,
      {
        props,
        modules: {
          "pagebuilder/dialog": {
            actions: { dirtySettings: dirtySettingsMock },
            namespaced: true,
          },
        },
        stubs: {
          EditorContent: true,
        },
      },
    );
    const changedRichTextInput = "abcdefg";
    wrapper
      .findComponent(RichTextEditor)
      .vm.$emit("update:modelValue", changedRichTextInput);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      changedRichTextInput,
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
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
    let localComponent = await mountJsonFormsComponent(RichTextInput, {
      props,
      withControllingFlowVariable: true,
    });
    let localWrapper = localComponent.wrapper;
    expect(localWrapper.vm.disabled).toBeTruthy();
    const editorComponent = localWrapper.findComponent(RichTextEditor);
    expect(editorComponent.vm.editable).toBeFalsy();
  });
});
