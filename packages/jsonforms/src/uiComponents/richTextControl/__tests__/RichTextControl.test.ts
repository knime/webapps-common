import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { RichTextEditor } from "@knime/rich-text-editor";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import { inputFormats } from "../../../constants";
import RichTextControl from "../RichTextControl.vue";

describe("RichTextControl.vue", () => {
  let props: VueControlTestProps<typeof RichTextControl>,
    wrapper: VueWrapper,
    changeValue: Mock,
    stubs;

  const labelForId = "myLabelForId";

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
      labelForId,
      disabled: false,
    };
    stubs = {
      EditorContent: true,
    };
    const component = mountJsonFormsControlLabelContent(RichTextControl, {
      props,
      stubs,
    });
    wrapper = component.wrapper;
    changeValue = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(RichTextControl).exists()).toBeTruthy();
    expect(wrapper.findComponent(RichTextEditor).exists()).toBeTruthy();
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(RichTextEditor).attributes().id).toBe(
      labelForId,
    );
  });

  it.skip("calls changeValue when html content is changed", () => {
    const changedRichTextControl = "abcdefg";
    wrapper
      .findComponent(RichTextEditor)
      .vm.$emit("update:modelValue", changedRichTextControl);
    expect(changeValue).toHaveBeenCalledWith(changedRichTextControl);
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

  it("disables editor if disabled", async () => {
    await wrapper.setProps({ disabled: true });
    const editorComponent = wrapper.findComponent(RichTextEditor);
    expect(editorComponent.vm.editable).toBeFalsy();
  });

  it("allows flow variable templates as urls if desired", () => {
    props.control.uischema.options!.useFlowVarTemplates = true;
    const { wrapper } = mountJsonFormsControlLabelContent(RichTextControl, {
      props,
    });
    // @ts-expect-error
    const { urlValidator, sanitizeUrlText } = wrapper
      .findComponent(RichTextEditor)
      .props("linkToolOptions");
    const flowVarTemplate = '$$["myFlowVariable"]';
    expect(urlValidator(flowVarTemplate)).toBe(true);
    expect(sanitizeUrlText(flowVarTemplate)).toBe(flowVarTemplate);
  });
});
