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
import RichTextEditor from "webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue";
import RichTextInput from "../RichTextInput.vue";
import { inputFormats } from "@/nodeDialog/constants";

describe("RichTextInput.vue", () => {
  let props, wrapper, onChangeSpy, component;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(RichTextInput.methods, "onChange");
  });

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
    component = mountJsonFormsComponent(RichTextInput, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(RichTextInput).exists()).toBeTruthy();
    expect(wrapper.findComponent(RichTextEditor).exists()).toBeTruthy();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when html content is changed", async () => {
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
      },
    );
    const changedRichTextInput = "abcdefg";
    wrapper
      .findComponent(RichTextEditor)
      .vm.$emit("update:modelValue", changedRichTextInput);
    expect(onChangeSpy).toHaveBeenCalledWith(changedRichTextInput);
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
    props = {
      ...props,
      control: {
        ...props.control,
        rootSchema: {
          ...props.control.rootSchema,
          flowVariablesMap: {
            richTextContent: {
              leaf: true,
              controllingFlowVariableAvailable: true,
              controllingFlowVariableName: "string-input",
              exposedFlowVariableName: null,
            },
          },
        },
      },
    };
    let localComponent = await mountJsonFormsComponent(RichTextInput, {
      props,
    });
    let localWrapper = localComponent.wrapper;
    expect(localWrapper.vm.disabled).toBeTruthy();
    const editorComponent = localWrapper.findComponent(RichTextEditor);
    expect(editorComponent.vm.editable).toBeFalsy();
  });
});
